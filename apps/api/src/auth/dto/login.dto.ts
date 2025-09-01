import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para requisição de login
 */
export class LoginDto {
  @ApiProperty({
    description: 'Nome de usuário para autenticação',
    example: 'admin',
    type: String,
    required: true,
  })
  @IsString({ message: 'O nome de usuário deve ser uma string' })
  @IsNotEmpty({ message: 'O nome de usuário é obrigatório' })
  username: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'password',
    type: String,
    required: true,
    minLength: 1,
  })
  @IsString({ message: 'A senha deve ser uma string' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(1, { message: 'A senha não pode estar vazia' })
  password: string;
}