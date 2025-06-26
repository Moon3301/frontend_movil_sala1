import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { MaterialModule } from '../material/material.module';
import { PreferencesComponent } from './pages/preferences/preferences.component';
import { CouponsComponent } from './pages/coupons/coupons.component';
import { RedeemPromotionComponent } from './pages/redeem-promotion/redeem-promotion.component';
import { CouponService } from './services/coupon.service';
import { DeleteAccountComponent } from './pages/delete-account/delete-account.component';

@NgModule({
  declarations: [
    LayoutPageComponent,
    AccountPageComponent,
    PreferencesComponent,
    CouponsComponent,
    RedeemPromotionComponent,
    DeleteAccountComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MaterialModule
  ],
  providers: [
    CouponService
  ],
})
export class UsersModule { }
