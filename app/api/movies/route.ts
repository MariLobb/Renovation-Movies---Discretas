import { NextResponse } from "next/server";
import moviesData from "@/data/movies.json";
import { Movie } from "@/types/movie";

const movies = moviesData as Movie[];

export async function GET() {
  // Solo devolver los nombres por ahora
  const titles = movies.map((movie, index) => ({
    id: index,
    title: movie.title,
  }));

  return NextResponse.json(titles);
}
