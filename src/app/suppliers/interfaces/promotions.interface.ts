
export interface Promotion {

  name: string;
  title: string;
  description: string;
  discount_value: string;
  promocode: string;
  promocode_uses: number;
  amount: number;
  start_date_promo: string;
  valid_from: string;
  valid_to: string;
  movieIds: number[];
  cinemasIds: number[];
  supplierId: number;
  companyIds: string[];
  sendType: string[];
  dateSend: string;
  timeSend: string;

}
