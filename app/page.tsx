import { MovieTitle } from "@/types/api";
import { headers } from "next/headers";

async function getMovies() {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const url = `${protocol}://${host}/api/movies`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

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
