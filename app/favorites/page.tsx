"use client";

import { useEffect, useState } from "react";
import MovieCard from "@/components/MovieCard";
import { Movie } from "@/types/movie";
import { useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import GenreFilter from "@/components/GenreFilter";

export default function FavoritesPage() {
  const search = useSearchParams();

  const query = search.get("query") || "";

  const genresParam = search.get("genres");

  const page = Number(search.get("page") || 1);
  const pageSize = 16;

  const [movies, setMovies] = useState<Movie[]>([]);
  const [total, setTotal] = useState(0);

  return (
    <main className="p-10 flex flex-col gap-4 items-center min-h-screen">
      <h1>⭐ Tus favoritos</h1>

      <SearchBar />
      <GenreFilter />

      {movies.length === 0 && (
        <p className="text-white/80">Aún no tienes películas favoritas.</p>
      )}

      <div className="bg-white/10 backdrop-blur-md rounded grid grid-cols-8 gap-4 p-4 md:w-3/4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} {...movie} />
        ))}
      </div>
      <Pagination page={page} limit={pageSize} total={total} />
    </main>
  );
}
