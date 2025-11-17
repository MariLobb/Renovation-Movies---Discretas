import { Movie } from "@/types/movie";
import Image from "next/image";

export default function MovieCard(movie: Movie) {
  const { title, poster_url, year } = movie;

  return (
    <div className="flex flex-col gap-2 relative w-full rounded-xl overflow-hidden bg-white/10 backdrop-blur-md p-1.5">
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
