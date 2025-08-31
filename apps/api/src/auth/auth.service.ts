import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // Lógica de validação de usuário (substitua por um banco de dados real)
  async validateUser(username: string, pass: string): Promise<any> {
    if (username === 'admin' && pass === 'password') {
      // No mundo real, não retornaríamos a senha
      return { userId: 1, username: 'admin' };
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
