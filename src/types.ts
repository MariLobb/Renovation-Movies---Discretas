
export interface Movie {
  id: number;
  title: string;
  original_title?: string;
  year: number;
  cast: string[];
  genres: string[];
  href: string; // Wikipedia URL
  extract: string;
  poster: string; // full URL
}

export type Graph = {
  movies: Record<string, Movie>; // key by title
  movieAdj: Record<string, Set<string>>;
};
