
# Recomendador de Películas (TMDb + Wikipedia)

**Sin WDQS** para evitar timeouts. Usamos:
- **TMDb API v3** para datos de películas, géneros, reparto y **pósters/backdrops** (imágenes).
- **Wikipedia Action API** para extracto y URL pública.
- **Wikimedia Analytics (Pageviews)** para popularidad de artículos.

Referencias:
- Cómo construir URLs de imágenes (TMDb **/configuration** e imagen base_url / tamaños).  
  https://developer.themoviedb.org/docs/image-basics  
  https://developer.themoviedb.org/reference/configuration-details  
- Lista oficial de géneros: **/genre/movie/list**.  
  https://developer.themoviedb.org/reference/genre-movie-list  
- Descubrimiento de películas: **/discover/movie** (con `with_genres`, `primary_release_date.gte`, `sort_by=popularity.desc`).  
  https://developer.themoviedb.org/reference/discover-movie  
- Unir respuestas (detalles+créditos) con **append_to_response=credits**.  
  https://developer.themoviedb.org/docs/append-to-response  
- Wikipedia Action API (extractos/miniaturas/info).  
  https://www.mediawiki.org/wiki/API:Action_API  
- Pageviews per‑article.  
  https://doc.wikimedia.org/generated-data-platform/aqs/analytics-api/

## Ejecutar
```bash
npm i
cp .env.example .env
# Pon tu TMDB_API_KEY y opcionalmente APP_LANG=es (usa es-ES internamente para TMDb)

npm run dev
# http://localhost:5173
```

## Flujo de la app
1) **Cargar géneros** (TMDb) y **Descargar semilla** (Discover por año/genre).  
2) Selecciona **≥10** películas semilla.  
3) **Construir grafo** (actor>género).  
4) **Recomendar** (BFS/Dijkstra): score 0–5 + Pageviews + razones.  
5) **Camino mínimo** (BFS) entre dos títulos.
