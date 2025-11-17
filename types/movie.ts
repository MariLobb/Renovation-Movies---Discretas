export interface Movie {
  title: string;
  year: number;
  cast: string[];
  genres: string[];
  href: string;
  extract: string;
  thumbnail: string;
  thumbnail_width: number;
  thumbnail_height: number;
}

export interface FilteredMovie {
  id: number;
  title: string;
  year: number;
  cast: string[];
  genres: string[];
  extract: string;
  thumbnail: string;
}
