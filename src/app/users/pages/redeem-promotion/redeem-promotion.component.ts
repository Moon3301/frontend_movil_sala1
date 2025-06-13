import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute }    from '@angular/router';
import { Observable, switchMap, EMPTY, map, tap } from 'rxjs';
import { CouponService } from '../../services/coupon.service';
import { Coupon, CouponView } from '../../interfaces/coupon.interface';

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

  coupon$!: Observable<CouponView>;

  showCode = false;

  constructor(
    private couponService: CouponService,
    private route: ActivatedRoute,

  ){}

  ngOnInit(): void {
    this.coupon$ = this.route.params.pipe(
      switchMap(({ promotionId }) => this.couponService.getCouponById(promotionId))
    );
  }

  claim() {
    this.showCode = true;
  }

  copyCode() {
    this.coupon$!.subscribe(coupon => {
      navigator.clipboard.writeText(coupon.code ?? '');
    });
  }

}
