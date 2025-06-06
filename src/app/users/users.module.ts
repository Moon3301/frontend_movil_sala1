import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { MaterialModule } from '../material/material.module';
import { PreferencesComponent } from './pages/preferences/preferences.component';

@NgModule({
  declarations: [
    LayoutPageComponent,
    AccountPageComponent,
    PreferencesComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MaterialModule
  ],
  providers: [],
})
export class UsersModule { }
