"use client";

import { Movie } from "@/types/movie";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function MovieCard(movie: Movie) {
  const { title, poster_url, year, id } = movie;

  const [isFavorite, setIsFavorite] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Toggle favorito
  const toggleFavorite = () => {
    const stored: number[] = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );

    let updated;
    if (stored.includes(id)) {
      updated = stored.filter((favId) => favId !== id); // quitar de favoritos
      setIsFavorite(false);
    } else {
      updated = [...stored, id];
      setIsFavorite(true);
    }

    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // Solo indicar que el componente se hidrató (sin leer localStorage aún)
  useEffect(() => {
    queueMicrotask(() => setHydrated(true));
  }, []);

  // Cargar favoritos solo después de hidratar
  useEffect(() => {
    if (!hydrated) return;

    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(stored.includes(id));
  }, [id, hydrated]);

  return (
    <div className="flex flex-col gap-2 relative w-full rounded-xl overflow-hidden bg-white/10 backdrop-blur-md p-1.5">
      <button
        onClick={toggleFavorite}
        className="absolute z-10 top-2 right-2 p-1.5 bg-black/30 backdrop-blur rounded-full cursor-pointer hover:scale-110 hover:bg-black/50 transition"
      >
        <Heart
          size={18}
          className={isFavorite ? "fill-red-500 text-red-500" : "text-white"}
        />
      </button>
      <div className="relative rounded-xl overflow-hidden w-full bg-white/10">
        <Image
          src={poster_url as string}
          alt={`Portada de ${title}`}
          width={500}
          height={750}
          className="object-contain rounded-xl"
        />
      </div>
      <div className="p-2 gap-0.5 flex flex-col">
        <p className="text-sm font-semibold">{title} </p>
        <p className="text-xs"> {year}</p>
      </div>
    </div>
  );
}
