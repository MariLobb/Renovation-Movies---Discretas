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

  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(startIndex + limit - 1, total);

  const rightDisabled = endIndex >= total;
  const leftDisabled = page === 1;

  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(newPage));
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex gap-4 mt-4">
      <button
        className="px-4 py-2 bg-blue-400 text-white rounded disabled:bg-gray-400 hover:transform hover:bg-blue-500 hover:scale-110 transition-all cursor-pointer"
        onClick={() => goToPage(page - 1)}
        disabled={leftDisabled}
      >
        <ChevronLeft />
      </button>
      <p className="flex items-center justify-center">
        {startIndex} / {endIndex} de {total}
      </p>
      <button
        className="px-4 py-2 bg-blue-400 text-white rounded disabled:bg-gray-400 hover:transform  hover:bg-blue-500 hover:scale-110 transition-all cursor-pointer"
        disabled={rightDisabled}
        onClick={() => goToPage(page + 1)}
      >
        <ChevronRight />
      </button>
    </div>
  );
}
