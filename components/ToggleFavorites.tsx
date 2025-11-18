"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ToggleFavorites() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Leer si está activo
  const onlyFavorites = searchParams.get("onlyFavorites") === "true";

  const toggle = () => {
    // Crear copia modificable
    const params = new URLSearchParams(searchParams);

    if (onlyFavorites) {
      // Si estaba activo → lo quitamos
      params.delete("onlyFavorites");
    } else {
      // Si no estaba activo → lo agregamos
      params.set("onlyFavorites", "true");
    }

    params.set("page", "1"); // reset paginación

    // Actualizar la URL
    router.push(`?${params.toString()}`);
    router.refresh(); // Opcional si necesitas recargar data
  };

  return (
    <button
      onClick={toggle}
      className="bg-white/10 px-4 py-2 rounded text-white hover:bg-white/20"
    >
      {onlyFavorites ? "Mostrar todas las películas" : "Mostrar solo favoritos"}
    </button>
  );
}
