export interface Coupon {
  id: string;
  title: string;
  description: string;
  promotionId: string;
  userId: string;
  code: string;
  discount_value: number;
  companies: any[];
  valid_from: Date;
  valid_to: Date;
  cinemaPromotions: any[];
  moviePromotions: any[];
  is_redeemed: boolean;
  redeemed_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface CouponView {
  id: number;
  name: string;
  title: string;
  description: string;
  discountValue: number;
  validFrom: Date;
  validTo: Date;
  cinemas: string[];
  movies:  string[];
  code?:   string;
}
