"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { genres } from "@/data/movies";

export default function GenreFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Leer géneros seleccionados desde la URL
  const selectedFromUrl = searchParams.get("genres");
  const initialSelected = selectedFromUrl
    ? selectedFromUrl.split(",").map(Number)
    : [];

  const [selectedGenres, setSelectedGenres] =
    useState<number[]>(initialSelected);

  const toggleGenre = (id: number) => {
    const newSelected = selectedGenres.includes(id)
      ? selectedGenres.filter((genre) => genre !== id)
      : [...selectedGenres, id];

    setSelectedGenres(newSelected);

    const params = new URLSearchParams(searchParams);

    if (newSelected.length > 0) {
      params.set("genres", newSelected.join(","));
    } else {
      params.delete("genres");
    }

    params.set("page", "1"); // reset paginación

    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex gap-3 flex-wrap bg-white/10 p-4 rounded-md backdrop-blur-md w-full md:w-3/4">
      {genres.map((g) => (
        <label key={g.id} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedGenres.includes(g.id)}
            onChange={() => toggleGenre(g.id)}
          />
          {g.name}
        </label>
      ))}
    </div>
  );
}
