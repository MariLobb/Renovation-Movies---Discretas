export interface Movie {
  id: number;
  title: string;
  year?: string | null;
  rating?: number;
  overview?: string;
  genres?: number[];
  poster_url: string | null;
  recommendations?: Recommendation[];
}

interface Recommendation {
  id: number;
  title: string;
  poster_url: string | null;
}
