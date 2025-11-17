"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Pagination({
  page,
  limit,
  total,
}: {
  page: number;
  limit: number;
  total: number;
}) {
  const router = useRouter();

  const startIndex = (page - 1) * 20 + 1;
  const endIndex = startIndex + limit;

  return (
    <div className="flex gap-4 mt-4">
      <button
        className="px-4 py-2 bg-blue-400 text-white rounded disabled:bg-gray-400 hover:transform hover:bg-blue-500 hover:scale-110 transition-all cursor-pointer"
        onClick={() =>
          page > 1
            ? router.push(`/?page=${page - 1}`)
            : console.log("Llego al limite inferior")
        }
      >
        <ChevronLeft />
      </button>
      <p className="flex items-center justify-center">
        {startIndex} / {endIndex} de {total}
      </p>
      <button
        className="px-4 py-2 bg-blue-400 text-white rounded disabled:bg-gray-400 hover:transform  hover:bg-blue-500 hover:scale-110 transition-all cursor-pointer"
        onClick={() =>
          endIndex !== total
            ? router.push(`/?page=${page + 1}`)
            : console.log("Llego al limite superior")
        }
      >
        <ChevronRight />
      </button>
    </div>
  );
}
