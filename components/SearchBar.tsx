"use client";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("query") || "";
  const [value, setValue] = useState(initialQuery);
  const [, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setValue(newQuery);

    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("query", newQuery);
      params.set("page", "1"); // resetear paginación

      router.push(`/?${params.toString()}`);
    });
  };

  return (
    <input
      value={value}
      onChange={handleChange}
      placeholder="Buscar películas..."
      className="p-2 rounded border w-full md:w-1/2 bg-white/10 backdrop-blur-md"
    />
  );
}
