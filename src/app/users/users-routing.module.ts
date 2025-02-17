import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { AccountPageComponent } from './pages/account-page/account-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [

      { path: 'account-page', component: AccountPageComponent },

      { path: '**', redirectTo: 'account-page' }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
