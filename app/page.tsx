import MovieCard from "@/components/MovieCard";
import Pagination from "@/components/Pagination";
import { getFilteredMovies, getTotalMoviesCount } from "./actions/movies";
import { Movie } from "@/types/movie";
import SearchBar from "@/components/SearchBar";
import GenreFilter from "@/components/GenreFilter";
import { cookies } from "next/headers";
import ToggleFavorites from "@/components/ToggleFavorites";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const search = await searchParams;

  const query = (search.query as string) || "";

  const genreParam = search.genres;
  const selectedGenres: number[] = genreParam
    ? (genreParam as string).split(",").map(Number)
    : [];

  const page = Number(search.page) || 1;
  const pageSize = 16;

  const onlyFavorites = search.onlyFavorites === "true";
  const cookieStore = cookies();
  const favoriteIds = JSON.parse(
    (await cookieStore).get("favorites")?.value || "[]"
  );

  const movies = await getFilteredMovies(
    query,
    selectedGenres,
    page,
    pageSize,
    onlyFavorites,
    favoriteIds
  );
  const total = await getTotalMoviesCount(
    query,
    selectedGenres,
    onlyFavorites,
    favoriteIds
  );

  return (
    <main className="p-10 flex flex-col gap-4 items-center  min-h-screen">
      <h1 className="">Renovation Movies</h1>

      <ToggleFavorites />
      <SearchBar />
      <GenreFilter />

      <div className="bg-white/10 backdrop-blur-md rounded  grid grid-cols-8 gap-4 p-4 md:w-3/4">
        {movies.map((movie: Movie) => (
          <MovieCard key={movie.id} {...movie} />
        ))}
      </div>
      <Pagination page={page} limit={pageSize} total={total} />
    </main>
  );
}
