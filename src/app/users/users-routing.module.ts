import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { PreferencesComponent } from './pages/preferences/preferences.component';

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
    path: '**',
    redirectTo: '',
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
