import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, switchMap, Observable } from "rxjs";
import { environments as env } from "../../../environments/environments";
import { CouponView } from "../interfaces/coupon.interface";
import { DeviceIdService } from "../../shared/services/deviceId.service";

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  constructor(private http: HttpClient, private deviceIdService: DeviceIdService) { }

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

  getDeviceId(): Observable<string> {
    return this.deviceIdService.getId();
  }

  assignCoupon(promotionId: number): Observable<any> {
    return this.getDeviceId().pipe(
      switchMap(deviceId =>
        this.http.post(`${env.baseUrl}/promotions/assign-promocode`, {
          promotionId,
          deviceId
        })
      )
    );
  }

  getCouponsByDeviceId(): Observable<any[]> {
    return this.getDeviceId().pipe(
      switchMap(deviceId =>
        this.http.get<any[]>(`${env.baseUrl}/promotions/by-device-id?deviceId=${deviceId}`)
      )
    );
  }
}
