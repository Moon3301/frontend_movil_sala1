import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environments as env } from "../../../environments/environments";
import { Coupon, CouponView } from "../interfaces/coupon.interface";

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  constructor(private http: HttpClient) { }

  getCouponById(promotionId: string | number): Observable<CouponView> {
    return this.http.get<CouponView>(`${env.baseUrl}/promotions/${promotionId}`).pipe(
      map(p => ({
        id:            p.id,
        name:          p.name,
        title:         p.title,
        description:   p.description,
        discountValue: p.discountValue,
        validFrom:     new Date(p.validFrom),
        validTo:       new Date(p.validTo),

        // 🔽 extrae nombres de cines y películas
        cinemas: (p.cinemas ?? []),
        movies:  (p.movies ?? []),

        code: p.code ?? ''          // puede venir vacío
      }))
    );
  }
}
