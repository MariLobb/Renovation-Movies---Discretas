import { MovieTitle } from "@/types/api";
import { getMovies } from "./actions/getMovies";

export default async function Home() {
  const { data } = await getMovies(3, 20);

  return (
    <main style={{ padding: 20 }}>
      <h1>Películas</h1>
      <ul>
        {data.map((movie: MovieTitle) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </main>
  );
}
