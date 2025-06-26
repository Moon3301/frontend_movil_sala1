import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { PreferencesComponent } from './pages/preferences/preferences.component';
import { CouponsComponent } from './pages/coupons/coupons.component';
import { RedeemPromotionComponent } from './pages/redeem-promotion/redeem-promotion.component';
import { DeleteAccountComponent } from './pages/delete-account/delete-account.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
  },
  {
    path: 'account',
    component: AccountPageComponent,
  },
  {
    path: 'preferences',
    component: PreferencesComponent,
  },
  {
    path: 'coupons',
    component: CouponsComponent,
  },
  {
    path: 'coupons/:promotionId',
    component: RedeemPromotionComponent,
  },
  {
    path: 'delete-account',
    component: DeleteAccountComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
