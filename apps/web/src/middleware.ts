import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas que não precisam de autenticação
  const publicRoutes = ['/login'];

  // Se está em uma rota pública, permite acesso
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Verifica se tem token no localStorage (através de cookie ou header)
  // Como não conseguimos acessar localStorage no middleware, vamos deixar o redirect
  // ser feito pelo lado do cliente

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
