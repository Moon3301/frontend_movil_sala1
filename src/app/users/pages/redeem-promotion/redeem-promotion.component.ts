import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute }    from '@angular/router';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { CouponService } from '../../services/coupon.service';
import { CouponView } from '../../interfaces/coupon.interface';
import { take } from 'rxjs/operators';   // opcional
import { DeviceIdService } from '../../../shared/services/deviceId.service';

@Component({
  selector: 'app-redeem-promotion',
  standalone: false,
  templateUrl: './redeem-promotion.component.html',
  styleUrls: ['./redeem-promotion.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class RedeemPromotionComponent implements OnInit {

  // Demo data, replace with real promotion data fetched from API or navigation extras
  // coupon!: CouponView;

  private couponSubject = new BehaviorSubject<CouponView | null>(null);
  coupon$ = this.couponSubject.asObservable();

  showCode = false;

  constructor(
    private couponService: CouponService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private deviceIdService: DeviceIdService

  ){}

  ngOnInit(): void {

    this.route.params.pipe(
      switchMap(({ promotionId }) => this.couponService.getCouponById(promotionId))
    ).subscribe(promo => this.couponSubject.next(promo));


  }

  claim() {
    this.couponSubject.pipe(take(1)).subscribe(coupon => {
      if (!coupon) return;

      this.couponService.assignCoupon(coupon.id).subscribe(resp => {
        // ⬇️ nuevo objeto ⇒ nueva emisión ⇒ la vista se refresca
        this.couponSubject.next({ ...coupon, code: resp.code });

        this.showCode = true;
        this.cdr.markForCheck();   // OnPush
      });
    });
  }

  copyCode() {
    this.couponSubject.pipe(take(1)).subscribe(c => {
      if (c?.code) navigator.clipboard.writeText(c.code);
    });
  }



}
