import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de resposta do usuário autenticado
 */
export class UserResponseDto {
  @ApiProperty({
    description: 'ID único do usuário',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Nome de usuário',
    example: 'admin',
    type: String,
  })
  username: string;
}

/**
 * DTO de resposta do login bem-sucedido
 */
export class LoginResponseDto {
  @ApiProperty({
    description: 'Token JWT para autenticação',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwic3ViIjoxLCJpYXQiOjE2MzUyODk2MDAsImV4cCI6MTYzNTI5MzIwMH0.signature',
    type: String,
  })
  access_token: string;

  @ApiProperty({
    description: 'Dados do usuário autenticado',
    type: UserResponseDto,
  })
  user: UserResponseDto;
}
