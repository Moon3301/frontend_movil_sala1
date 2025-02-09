export interface Movie {
  id: number;
  title_slug?: string;
  company?: string;
  title: string;
  synopsis: string;
  synopsis_alt: string;
  trailer_url: string;
  img_url: string;
  opening_date: string;
  isPremiere: boolean;
  rating: string;
  external_id: string;

}
