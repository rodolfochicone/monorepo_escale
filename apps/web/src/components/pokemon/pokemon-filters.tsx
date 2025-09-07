"use client";

import { useState, useEffect } from "react";
import { Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PokemonFiltersProps {
  searchQuery: string;
  typeFilter: string;
  pageSize: number;
  onSearchChange: (query: string) => void;
  onTypeFilterChange: (type: string) => void;
  onPageSizeChange: (size: number) => void;
  onResetFilters: () => void;
  className?: string;
}

const pokemonTypes = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

const pageSizeOptions = [5, 10, 20, 50];

export function PokemonFilters({
  searchQuery,
  typeFilter,
  pageSize,
  onSearchChange,
  onTypeFilterChange,
  onPageSizeChange,
  onResetFilters,
  className,
}: PokemonFiltersProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchQuery !== searchQuery) {
        onSearchChange(localSearchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchQuery, searchQuery, onSearchChange]);

  // Sync local state with prop changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const hasFilters = searchQuery || typeFilter;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Linha superior: Busca e Filtros */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Busca */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {localSearchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocalSearchQuery("")}
              className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Controles */}
        <div className="flex items-center gap-2">
          {/* Filtro por tipo */}
          <Select
            value={typeFilter || "all"}
            onValueChange={(value) =>
              onTypeFilterChange(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {pokemonTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  <span className="capitalize">{type}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Items por página */}
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(parseInt(value))}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Botão de limpar filtros */}
          {hasFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="shrink-0"
            >
              <X className="mr-2 h-4 w-4" />
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Filtros ativos */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtros ativos:</span>

          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Busca: &quot;{searchQuery}&quot;
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSearchChange("")}
                className="h-4 w-4 p-0 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {typeFilter && (
            <Badge variant="secondary" className="gap-1">
              Tipo: <span className="capitalize">{typeFilter}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTypeFilterChange("")}
                className="h-4 w-4 p-0 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
