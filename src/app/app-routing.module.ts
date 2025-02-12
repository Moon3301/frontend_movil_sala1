import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/pages/main-layout/main-layout.component';

const routes: Routes = [

  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'movies',
        loadChildren: () => import('./movie/movie.module').then( m => m.MovieModule)
      },
      {
        path: 'administration',
        loadChildren: () => import('./administration/administration.module').then( m => m.AdministrationModule)
      },
      {
        path: '', redirectTo: 'movies', pathMatch: 'full'
      },

    ]

  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule)
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
