import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { AccountSupplierComponent } from './pages/account-supplier/account-supplier.component';
import { PromotionsPageComponent } from './pages/promotions-page/promotions-page.component';

const routes: Routes = [
  { path: '', component: LayoutPageComponent }, // solo el menú principal
  { path: 'account', component: AccountSupplierComponent }, // sin menú
  { path: 'promotions', component: PromotionsPageComponent }, // sin menú
  { path: '**', redirectTo: '' },
  { path: '', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuppliersRoutingModule { }
