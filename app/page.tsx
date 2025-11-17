import { MovieTitle } from "@/types/api";

async function getMovies() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/movies`, {
    cache: "no-store",
  });
  return res.json();
}

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
