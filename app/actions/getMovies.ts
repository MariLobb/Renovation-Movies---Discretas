"use server";

import moviesData from "@/data/movies.json";
import { Movie } from "@/types/movie";

const movies = moviesData as Movie[];

export async function getMovies() {
  // Por ahora devolvemos solo los primeros 50
  return movies.slice(0, 50).map((movie, index) => ({
    id: index, // tu dataset no tiene id, así que lo creamos temporalmente
    title: movie.title,
  }));
}
