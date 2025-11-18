"use client";

import { useMovieFilter } from "@/hooks/useMovieFilter";

export default function FilterBar() {
  const {
    toggleFavorites,
    toggleRecommendations,
    isFavorites,
    isRecommendations,
  } = useMovieFilter();

  return (
    <div className="flex gap-2">
      <button
        onClick={toggleFavorites}
        className={isFavorites ? "bg-blue-600" : "bg-gray-600"}
      >
        Favoritos
      </button>

      <button
        onClick={toggleRecommendations}
        className={isRecommendations ? "bg-blue-600" : "bg-gray-600"}
      >
        Recomendaciones
      </button>
    </div>
  );
}
