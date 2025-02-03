export interface ICines {
  chain:   string;
  cinemas: ICinema[];
}

export interface ICinema {
  id:        number;
  name:      string;
  ubication: string;
  slug:      string;
  schedule:  ISchedule[];
}

export interface ISchedule {
  date:  Date;
  hours: IHour[];
}

export interface IHour {
  billboardId: number;
  hour:        string;
  language:    string;
  movie:       IMovie;
}

export interface IShowtime {
  billboardId: number;
  language:    string;
  date:        Date;
  hour:        string;
  movie:       IMovie;
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
