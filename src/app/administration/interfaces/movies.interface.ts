export interface Company {
  name: string
  movies:  Movie[];

}

export interface ListsCarrusel {
  moviesCarrusel: MovieCarrusel[],
  filterMovies: MovieCarrusel[]
}

export interface MovieCarrusel {
  id:              number;
  position:        number;
  title_snapshoot: string;
  movieId:         number;
  img_url?:        string;
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
  screen_type: string;

}

export interface UploadMoviePosterResponse {
  poster_url: string;
}
