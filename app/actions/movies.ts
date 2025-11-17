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
  return movies.filter((movie) => {
    const matchesTitle = movie.title
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesGenre =
      genreIds.length === 0 || genreIds.some((id) => movie.genres.includes(id));
    return matchesTitle && matchesGenre;
  });
}
