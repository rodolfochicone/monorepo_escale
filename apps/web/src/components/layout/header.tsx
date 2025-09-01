"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { usePokemon } from "@/hooks/use-pokemon";
import { useAuthStore } from "@/store/auth-store";
import { LogOut, User } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { pokemonCount } = usePokemon();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navigation = [
    { name: "Início", href: "/" },
    { name: "Minha Coleção", href: "/pokemons" },
    { name: "Adicionar", href: "/pokemons/new" },
  ];

  // Se não está autenticado e não está na página de login, não mostra navegação
  const shouldShowNavigation = isAuthenticated || pathname === '/login';

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={isAuthenticated ? "/" : "/login"} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="text-2xl animate-pulse">⚡</div>
            <span className="font-bold text-xl">PokéManager</span>
          </Link>

          {/* Navegação Desktop */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-all duration-200 hover:text-primary hover:scale-105 ${pathname === item.href
                    ? "text-foreground border-b-2 border-primary pb-1"
                    : "text-muted-foreground"
                    }`}
                >
                  {item.name}
                  {item.href === "/pokemons" && pokemonCount > 0 && (
                    <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground animate-in fade-in-0 slide-in-from-right-2">
                      {pokemonCount}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          )}

          {/* Ações Desktop */}
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                {/* User Info */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{user?.username}</span>
                </div>

                {/* Pokémon Count */}
                <div className="hidden sm:flex items-center space-x-2">
                  {pokemonCount > 0 && (
                    <Button variant="ghost" size="sm" asChild className="hover:scale-105 transition-transform">
                      <Link href="/pokemons">
                        <span className="hidden md:inline">
                          {pokemonCount} Pokémon{pokemonCount !== 1 ? "s" : ""}
                        </span>
                        <span className="md:hidden">
                          {pokemonCount}
                        </span>
                      </Link>
                    </Button>
                  )}
                </div>

                {/* Logout Button */}
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </>
            ) : (
              !pathname.startsWith('/login') && (
                <Button asChild size="sm">
                  <Link href="/login">
                    <User className="h-4 w-4 mr-2" />
                    Entrar
                  </Link>
                </Button>
              )
            )}
          </div>

          {/* Menu Mobile para usuários autenticados */}
          {isAuthenticated && (
            <div className="flex sm:hidden items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/pokemons">
                  📚 {pokemonCount || 0}
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/pokemons/new">
                  +
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Navegação Mobile para usuários autenticados */}
        {isAuthenticated && (
          <nav className="md:hidden border-t py-2">
            <div className="flex justify-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-medium transition-colors hover:text-primary ${pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}