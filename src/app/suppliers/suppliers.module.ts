import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { AccountSupplierComponent } from './pages/account-supplier/account-supplier.component';
import { SuppliersRoutingModule } from './supplies-routing.module';
import { MaterialModule } from '../material/material.module';
import { StepperPromoComponent } from './components/stepper-promo/stepper-promo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PromotionsPageComponent } from './pages/promotions-page/promotions-page.component';



@NgModule({
  declarations: [
    LayoutPageComponent,
    AccountSupplierComponent,
    StepperPromoComponent,
    PromotionsPageComponent
  ],
  imports: [
    CommonModule,
    SuppliersRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SuppliersModule { }
