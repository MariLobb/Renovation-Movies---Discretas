import MovieCard from "@/components/MovieCard";
import Pagination from "@/components/Pagination";
import { getFilteredMovies, getTotalMoviesCount } from "./actions/movies";
import { Movie } from "@/types/movie";
import SearchBar from "@/components/SearchBar";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const search = await searchParams;

  const query = (search.query as string) || "";
  const selectedGenres: number[] = []; // array de géneros seleccionados
  const page = Number(search.page) || 1;
  const pageSize = 16;

  const movies = await getFilteredMovies(query, selectedGenres, page, pageSize);
  const total = await getTotalMoviesCount(query, selectedGenres);

  return (
    <main className="p-10 flex flex-col gap-2 items-center  min-h-screen">
      <h1 className="">Películas</h1>
      <SearchBar />
      <div className="bg-white/10 backdrop-blur-md rounded  grid grid-cols-8 gap-4 p-4 md:w-3/4">
        {movies.map((movie: Movie) => (
          <MovieCard key={movie.id} {...movie} />
        ))}
      </div>
      <Pagination page={page} limit={pageSize} total={total} />
    </main>
  );
}
