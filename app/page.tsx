import MovieCard from "@/components/MovieCard";
import Pagination from "@/components/Pagination";
import { getFilteredMovies } from "@/app/actions/movies";
import { Movie } from "@/types/movie";
import SearchBar from "@/components/SearchBar";
import GenreFilter from "@/components/GenreFilter";
import { cookies } from "next/headers";
import FilterBar from "@/components/FilterBars";

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

  const onlyFavorites = search.favorites === "true";
  const onlyRecommendations = search.recommendations === "true";

  const isLikeable = !onlyRecommendations;

  const cookieStore = cookies();
  const favoriteIds = JSON.parse(
    (await cookieStore).get("favorites")?.value || "[]"
  );

  const { finalMovies, total } = await getFilteredMovies(
    query,
    selectedGenres,
    page,
    pageSize,
    onlyFavorites,
    favoriteIds,
    onlyRecommendations
  );

  return (
    <main className="p-10 flex flex-col gap-4 items-center  min-h-screen">
      <h1 className="">Renovation Movies</h1>

      <FilterBar />
      <SearchBar />
      {!onlyRecommendations && <GenreFilter />}

      <div className="bg-white/10 backdrop-blur-md rounded  grid grid-cols-8 gap-4 p-4 md:w-3/4">
        {finalMovies.map((movie: Movie) => (
          <MovieCard key={movie.id} isLikeable={isLikeable} {...movie} />
        ))}
      </div>
      <Pagination page={page} limit={pageSize} total={total} />
    </main>
  );
}
