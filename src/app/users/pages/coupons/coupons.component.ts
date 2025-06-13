import { Component } from '@angular/core';

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
export class CouponsComponent {

  coupons: Coupon[] = [
    { id: '1', title: '10% OFF', description: 'Descuento del 10% en tu próxima compra.', isRedeemed: false },
    { id: '2', title: '2x1 Café', description: 'Lleva dos cafés y paga uno.', isRedeemed: false }
  ];

  redeemCoupon(coupon: Coupon) {
    // Aquí iría la lógica para reclamar el cupón
    alert(`Cupón reclamado: ${coupon.title}`);
    // Opcional: eliminar el cupón de la lista tras reclamar
    this.coupons = this.coupons.map(c => c.id === coupon.id ? { ...c, isRedeemed: true } : c);
  }

}
