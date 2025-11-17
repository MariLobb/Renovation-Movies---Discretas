import { MovieTitle } from "@/types/api";
import { headers } from "next/headers";
import { getMovies } from "./actions/getMovies";

export default async function Home() {
  const movies = await getMovies();

  return (
    <main style={{ padding: 20 }}>
      <h1>Películas</h1>
      <ul>
        {movies.map((movie: MovieTitle) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </main>
  );
}
