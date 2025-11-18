// serverActions/movies.ts

import { movies } from "@/data/movies";

export async function getFilteredMovies(
  query: string = "",
  genreIds: number[] = [],
  page: number = 1,
  pageSize: number = 24,
  onlyFavorites: boolean = false,
  favoriteIds: number[] = []
) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const filtered = filterMovies(query, genreIds, onlyFavorites, favoriteIds);

  return filtered.slice(start, end);
}

export async function getTotalMoviesCount(
  query: string = "",
  genreIds: number[] = [],
  onlyFavorites: boolean = false,
  favoriteIds: number[] = []
) {
  const filtered = filterMovies(query, genreIds, onlyFavorites, favoriteIds);
  return filtered.length;
}

export async function getMoviesByIds(ids: number[]) {
  return movies.filter((movie) => ids.includes(movie.id));
}

export async function getRecomendations() {}

function filterMovies(
  query: string,
  genreIds: number[],
  onlyFavorites: boolean = false,
  favoriteIds: number[] = []
) {
  return movies.filter(
    (movie) =>
      matchesTitle(movie.title, query) &&
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
