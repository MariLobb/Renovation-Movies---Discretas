import { MovieTitle } from "@/types/api";
import { headers } from "next/headers";

async function getMovies() {
  const h = await headers();
  const host = h.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  console.log("HOST:", host);

  const res = await fetch(`${protocol}://${host}/api/movies`, {
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
