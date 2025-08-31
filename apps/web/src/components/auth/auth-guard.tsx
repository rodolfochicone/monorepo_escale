'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    // Se não está autenticado e não está em uma rota pública, redireciona para login
    if (!isAuthenticated && !isPublicRoute) {
      router.push('/login');
    }

    // Se está autenticado e está na página de login, redireciona para home
    if (isAuthenticated && pathname === '/login') {
      router.push('/');
    }
  }, [isAuthenticated, isPublicRoute, pathname, router]);

  // Se não está autenticado e não está em rota pública, não renderiza nada
  // (vai redirecionar)
  if (!isAuthenticated && !isPublicRoute) {
    return null;
  }

  return <>{children}</>;
}
