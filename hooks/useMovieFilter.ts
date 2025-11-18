"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function useMovieFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const toggleFavorites = () => {
    const params = new URLSearchParams(searchParams.toString());

    const isActive = params.get("favorites") === "true";

    // Si lo activo, desactivo recommendations
    if (!isActive) {
      params.set("favorites", "true");
      params.delete("recommendations");
    } else {
      // Si lo desactivo, elimino favorites
      params.delete("favorites");
    }

    params.set("page", "1"); // reset paginación

    router.push(`?${params.toString()}`);
  };

  const toggleRecommendations = () => {
    const params = new URLSearchParams(searchParams.toString());

    const isActive = params.get("recommendations") === "true";

    // Si lo activo, desactivo favorites
    if (!isActive) {
      params.set("recommendations", "true");
      params.delete("favorites");
    } else {
      // Si lo desactivo, lo elimino
      params.delete("recommendations");
    }

    params.set("page", "1"); // reset paginación

    router.push(`?${params.toString()}`);
  };

  return {
    toggleFavorites,
    toggleRecommendations,
    isFavorites: searchParams.get("favorites") === "true",
    isRecommendations: searchParams.get("recommendations") === "true",
  };
}
