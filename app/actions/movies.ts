// serverActions/movies.ts

import { movies } from "@/data/movies";

export async function getFilteredMovies(
  query: string = "",
  genreIds: number[] = [],
  page: number = 1,
  pageSize: number = 24
) {
  const filtered = filterMovies(query, genreIds);

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return filtered.slice(start, end);
}

export async function getTotalMoviesCount(
  query: string = "",
  genreIds: number[] = []
) {
  const filtered = filterMovies(query, genreIds);
  return filtered.length;
}

function filterMovies(query: string, genreIds: number[]) {
  return movies.filter(
    (movie) =>
      matchesTitle(movie.title, query) && matchesGenres(movie.genres, genreIds)
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
