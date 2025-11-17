"use server";

import moviesData from "@/data/movies.json";
import { Movie } from "@/types/movie";

const movies = moviesData as Movie[];

// Valida que la película tenga los campos mínimos requeridos
function isValidMovie(movie: Movie): boolean {
  return (
    movie.title !== "" &&
    movie.year > 0 &&
    movie.cast &&
    movie.cast.length >= 3 && // al menos 3 actores
    movie.genres &&
    movie.genres.length >= 1 && // al menos un género
    movie.extract !== "" && // sinopsis
    movie.thumbnail !== "" && // poster
    ["title", "year", "cast", "cast", "genres", "extract", "thumbnail"].every(
      (key) => key in movie
    )
  );
}

export async function getMovies(page = 1, limit = 20) {
  const filtered = movies.filter(isValidMovie);

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated = filtered.slice(start, end).map((movie, index) => ({
    id: start + index,
    title: movie.title,
    year: movie.year,
    cast: movie.cast,
    genres: movie.genres,
    extract: movie.extract,
    thumbnail: movie.thumbnail,
  }));

  // Por ahora devolvemos solo los primeros 50
  return {
    total: filtered.length,
    data: paginated,
  };
}
