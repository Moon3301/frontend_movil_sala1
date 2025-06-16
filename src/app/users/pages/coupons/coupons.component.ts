import { Component, OnInit } from '@angular/core';
import { CouponService } from '../../services/coupon.service';
import { Router } from '@angular/router';

interface Coupon {
  id: string;
  title: string;
  description: string;
  isRedeemed: boolean;
}

@Component({
  selector: 'app-coupons',
  standalone: false,
  templateUrl: './coupons.component.html',
  styleUrl: './coupons.component.css'
})
export class CouponsComponent implements OnInit {

  coupons: any[] = [];

  constructor( private couponService: CouponService, private router: Router){}

  ngOnInit(): void {

    this.couponService.getCouponsByDeviceId().subscribe({
      next: (coupons: any[]) => {
        this.coupons = coupons;
      },
      error: () => { console.log('Error al obtener los cupones') }
    });

  }

  redirectToCoupon(coupon: any) {
    this.router.navigate(['/users/coupons', coupon.promotion.id]);
  }

  redeemCoupon(coupon: any) {
    // Aquí iría la lógica para reclamar el cupón
    alert(`Cupón reclamado: ${coupon.title}`);
    // Opcional: eliminar el cupón de la lista tras reclamar
    this.coupons = this.coupons.map(c => c.id === coupon.id ? { ...c, isRedeemed: true } : c);
  }

}
