import { MovieTitle } from "@/types/api";
import { getMovies } from "./actions/getMovies";
import MovieCard from "@/components/MovieCard";
import Pagination from "@/components/Pagination";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const search = await searchParams;
  const page = Number(search.page) || 1;
  const limit = 24;
  const { data, total } = await getMovies(page, limit);

  return (
    <main className="p-10 flex flex-col gap-2 items-center  min-h-screen">
      <h1 className="">Películas</h1>
      <div className="bg-white/10 backdrop-blur-md rounded flex-1  grid grid-cols-8 grid-rows-3 gap-4 p-4 md:w-3/4">
        {data.map((movie: MovieTitle) => (
          <MovieCard key={movie.id} {...movie} />
        ))}
      </div>
      <Pagination page={page} limit={limit} total={total} />
    </main>
  );
}
