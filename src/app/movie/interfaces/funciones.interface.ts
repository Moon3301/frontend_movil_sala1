export interface ICines {
  
  cinemaType:     string;
  cinemas:        ICinema[];
}

export interface ICinema {

  cinemaId:         number;
  cinemaName:       string;
  cinemaSlug:       string;
  cinemaExternalId: string;
  vistaId:          string;
  showtimes:        Showtime[];
  version:          Version
}

export interface Version {

  id:              number,
  comany:          string,
  title:           string
}

export interface Showtime {

  showtimeId:         number;
  showtime:           string;
  showdate:           string;
  language:           string;
  showtimeExternalId: string;
  sessionId:          string;
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
