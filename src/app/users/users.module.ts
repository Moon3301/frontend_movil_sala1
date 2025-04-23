import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [
    LayoutPageComponent,
    AccountPageComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MaterialModule
  ],
  providers: [],
})
export class UsersModule { }
