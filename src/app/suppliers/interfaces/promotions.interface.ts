import { Movie } from "../../movie/interfaces/movie.interface";
import { Supplier } from "./supplier.interface";

export interface Promotion {

  id: number;
  name: string;
  title: string;
  description: string;
  discount_value: string;
  promocode: string;
  promocode_uses: number;
  promocode_limit: number;
  start_date_promo: string;
  valid_from: string;
  valid_to: string;
  movies: Movie[];
  supplier: Supplier;

}
