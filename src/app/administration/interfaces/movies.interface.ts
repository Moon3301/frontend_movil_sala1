export interface Company {
  name: string
  movies:  Movie[];

}

export interface Movie {
  id:           number;
  title:        string;
  title_slug:   string;
  company:      string;
  opening_date: Date;
  isPremiere:   boolean;
}
