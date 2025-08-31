import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PokemonSkeletonProps {
  variant?: "default" | "compact";
  count?: number;
}

export function PokemonSkeleton({ variant = "default", count = 1 }: PokemonSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);
  const isCompact = variant === "compact";

  return (
    <>
      {skeletons.map((index) => (
        <Card key={index} className={isCompact ? "p-2" : "p-4"}>
          <CardContent className={isCompact ? "p-2" : "p-4"}>
            <div className="text-center space-y-3">
              {/* Skeleton da imagem */}
              <div className="flex justify-center">
                <Skeleton className={`rounded-full ${isCompact ? "w-12 h-12" : "w-20 h-20"}`} />
              </div>

              {/* Skeleton do nome */}
              <div className="space-y-1">
                <Skeleton className={`mx-auto ${isCompact ? "h-3 w-16" : "h-4 w-20"}`} />
                <Skeleton className={`mx-auto ${isCompact ? "h-2 w-10" : "h-3 w-12"}`} />
              </div>

              {/* Skeleton dos tipos */}
              <div className="flex justify-center gap-1">
                <Skeleton className={`${isCompact ? "h-4 w-10" : "h-5 w-12"} rounded-full`} />
                <Skeleton className={`${isCompact ? "h-4 w-8" : "h-5 w-10"} rounded-full`} />
              </div>

              {/* Skeleton das habilidades (apenas na versão padrão) */}
              {!isCompact && (
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16 mx-auto" />
                  <div className="flex justify-center gap-1">
                    <Skeleton className="h-6 w-14 rounded-md" />
                    <Skeleton className="h-6 w-12 rounded-md" />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export function PokemonListSkeleton({ variant = "grid" }: { variant?: "grid" | "compact" }) {
  return (
    <div className={`grid gap-4 ${variant === "compact"
      ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      }`}>
      <PokemonSkeleton
        variant={variant === "compact" ? "compact" : "default"}
        count={variant === "compact" ? 12 : 8}
      />
    </div>
  );
}

export function PokemonDetailSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-9 w-16" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card principal skeleton */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <CardContent className="p-4">
                <div className="text-center space-y-3">
                  <div className="flex justify-center">
                    <Skeleton className="w-20 h-20 rounded-full" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-24 mx-auto" />
                    <Skeleton className="h-3 w-12 mx-auto" />
                  </div>
                  <div className="flex justify-center gap-1">
                    <Skeleton className="h-5 w-12 rounded-full" />
                    <Skeleton className="h-5 w-10 rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detalhes skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações básicas skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Skeleton className="h-4 w-12 mb-2" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-18 rounded" />
                    <Skeleton className="h-6 w-16 rounded" />
                    <Skeleton className="h-6 w-14 rounded" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>

            {/* Imagem skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-16" />
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <Skeleton className="w-64 h-64" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
