// serverActions/movies.ts

import { movies } from "@/data/movies";
import { Movie } from "@/types/movie";

export async function getFilteredMovies(
  query: string = "",
  genreIds: number[] = [],
  page: number = 1,
  pageSize: number = 24,
  onlyFavorites: boolean = false,
  favoriteIds: number[] = [],
  onlyRecommendations: boolean = false
): Promise<{ finalMovies: Movie[]; total: number }> {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const filtered = filterMovies(genreIds, onlyFavorites, favoriteIds);

  if (onlyRecommendations) {
    // Obtener recomendaciones basadas en favoritos
    const recommendations = getRecommendations(filtered, favoriteIds).filter(
      (movie) => matchesTitle(movie.title, query)
    );
    return {
      finalMovies: recommendations.slice(start, end),
      total: recommendations.length,
    };
  }

  const finalMovies = filtered.filter((movie) =>
    matchesTitle(movie.title, query)
  );
  return {
    finalMovies: finalMovies.slice(start, end),
    total: finalMovies.length,
  };
}

export async function getMoviesByIds(ids: number[]) {
  return movies.filter((movie) => ids.includes(movie.id));
}

function getRecommendations(movies: Movie[], favoriteIds: number[]) {
  const result: { id: number; title: string; poster_url: string }[] = [];

  const seen = new Set<number>();

  const favorites = movies.filter((m) => favoriteIds.includes(m.id));

  for (const movie of favorites) {
    // Agregar película principal
    if (!seen.has(movie.id)) {
      result.push({
        id: movie.id,
        title: movie.title,
        poster_url: movie.poster_url!,
      });
      seen.add(movie.id);
    }

    // Agregar recomendaciones
    for (const rec of movie.recommendations ?? []) {
      if (!seen.has(rec.id)) {
        result.push({
          id: rec.id,
          title: rec.title,
          poster_url: rec.poster_url!,
        });
        seen.add(rec.id);
      }
    }
  }

  return result;
}

function filterMovies(
  genreIds: number[],
  onlyFavorites: boolean = false,
  favoriteIds: number[] = []
) {
  return movies.filter(
    (movie) =>
      matchesGenres(movie.genres, genreIds) &&
      matchesFavorites(movie.id, onlyFavorites, favoriteIds)
  );
}

function matchesTitle(title: string, search: string) {
  if (!search.trim()) return true; // Si la búsqueda está vacía, coincide con todo
  return title.toLowerCase().includes(search.toLowerCase());
}

function matchesGenres(movieGenres: number[], selected: number[]) {
  if (selected.length === 0) return true; // Si no hay géneros seleccionados, coincide con todo
  return selected.every((g) => movieGenres.includes(g));
}

function matchesFavorites(
  movieId: number,
  onlyFavorites: boolean,
  favoriteIds: number[]
) {
  if (!onlyFavorites) return true;
  if (favoriteIds.length === 0) return false;
  return favoriteIds.includes(movieId);
}
