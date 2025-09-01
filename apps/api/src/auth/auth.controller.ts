import { Controller, Post, Body, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
  ApiProduces,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiProperty } from '@nestjs/swagger';

// DTO inline para resposta de login
class LoginResponseDto {
  @ApiProperty({
    description: 'Token JWT para autenticação',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Dados do usuário autenticado',
    example: { id: 1, username: 'admin' },
  })
  user: {
    id: number;
    username: string;
  };
}
import { ErrorResponseDto } from '../pokemon/dto/pokemon-response.dto';

@ApiTags('auth')
@Controller('auth')
@ApiConsumes('application/json')
@ApiProduces('application/json')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @ApiOperation({
    summary: 'Realizar login',
    description: `
      Autentica um usuário e retorna um token JWT para acesso aos endpoints protegidos.
      
      **Credenciais padrão:**
      - Usuário: admin
      - Senha: password
      
      **O token JWT deve ser usado no header Authorization como "Bearer {token}"**
    `,
  })
  @ApiBody({
    type: LoginDto,
    description: 'Credenciais de login',
    examples: {
      admin: {
        summary: 'Login Administrador',
        description: 'Credenciais do usuário administrador padrão',
        value: {
          username: 'admin',
          password: 'password'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Login realizado com sucesso',
    type: LoginResponseDto,
    examples: {
      success: {
        summary: 'Login bem-sucedido',
        value: {
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            id: 1,
            username: 'admin'
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Dados de entrada inválidos',
    type: ErrorResponseDto,
    examples: {
      'invalid-data': {
        summary: 'Dados inválidos',
        value: {
          statusCode: 400,
          message: 'O nome de usuário é obrigatório',
          error: 'Bad Request',
          timestamp: '2025-08-31T20:30:00.000Z',
          path: '/auth/login'
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
    type: ErrorResponseDto,
    examples: {
      'invalid-credentials': {
        summary: 'Credenciais incorretas',
        value: {
          statusCode: 401,
          message: 'Invalid credentials',
          error: 'Unauthorized',
          timestamp: '2025-08-31T20:30:00.000Z',
          path: '/auth/login'
        }
      }
    }
  })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }
}