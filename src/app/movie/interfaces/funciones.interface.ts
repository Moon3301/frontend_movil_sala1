export interface ICines {
  cinemaType:   string;
  cinemas: ICinema[];
}

export interface ICinema {
  cinemaId:         number;
  cinemaName:       string;
  cinemaSlug:      string;
  cinemaExternalId: number;
  vistaId:          string;
  showtimes:        Showtime[];

}

export interface Showtime {

  showtimeId:         number;
  showtime:           string;
  showdate:           string;
  language:           string;
  showtimeExternalId: string;

}

export interface IMovie {
  id:           number;
  tittle_slug:  string;
  company:      string;
  tittle:       string;
  synopsis:     string;
  synopsis_alt: string;
  trailer_url:  string;
  img_url:      string;
  opening_date: Date;
  isPremiere:   boolean;
  rating:       string;
}
