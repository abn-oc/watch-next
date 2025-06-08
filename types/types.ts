type SearchItem = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: "series" | "movie" | "episode";
  Poster: string;
};

type Rating = {
  Source: string;
  Value: string;
};

type MediaDetails = {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Rating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: 'movie' | 'series' | 'episode';
  totalSeasons?: string; // only for series
  Response: 'True' | 'False';
};
