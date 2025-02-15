export interface Company {
  name: string
  movies:  Movie[];

}

export interface ListsCarrusel {
  moviesCarrusel: MovieCarrusel[],
  filterMovies: MovieCarrusel[]
}

export interface MovieCarrusel {
  movieId?:        number;
  position:        number;
  title_snapshoot: string;
  poster_url:      string;
  externalMovieId: number;
}

export interface Movie {
  id:           number;
  external_id:  string;
  img_url:      string;
  title:        string;
  title_slug:   string;
  rating:       string;
  trailer_url:  string;
  synopsis:     string;
  synopsis_alt: string;

}
