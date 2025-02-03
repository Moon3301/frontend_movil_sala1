import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillboardRoutingModule } from './billboard-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { BillboardPageComponent } from './pages/billboard-page/billboard-page.component';
import { CardComponent } from './components/card/card.component';
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [
    LayoutPageComponent,
    BillboardPageComponent,
    CardComponent
  ],
  imports: [
    CommonModule,
    BillboardRoutingModule,
    MaterialModule
  ]
})
export class BillboardModule { }
