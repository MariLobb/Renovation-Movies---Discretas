import { FilteredMovie } from "@/types/movie";
import Image from "next/image";

export default function MovieCard(movie: FilteredMovie) {
  const { title, thumbnail, year } = movie;

  return (
    <div className="flex flex-col gap-2 relative w-full rounded overflow-hidden bg-white/10 backdrop-blur-md p-1.5">
      <div className="relative flex-[0.8] rounded overflow-hidden">
        <Image
          src={thumbnail}
          alt={`Imagen ${title}`}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-[0.2] p-2 gap-0.5 flex flex-col">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs"> {year}</p>
      </div>
    </div>
  );
}
