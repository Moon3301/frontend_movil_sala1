import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/pages/main-layout/main-layout.component';
import { authGuard } from './auth/guards/auth.guard';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { UpdateAppComponent } from './shared/pages/update-app/update-app.component';

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
        canActivate: [authGuard],
        loadChildren: () => import('./administration/administration.module').then( m => m.AdministrationModule)
      },
      {
        path: 'account',
        loadChildren: () => import('./users/users.module').then( m => m.UsersModule)
      },
      {
        path: '', redirectTo: 'movies', pathMatch: 'full',
      },
    ]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule)
  },
  {
    path: 'error404',
    component: Error404PageComponent,
  },
  {
    path: 'updateApp',
    component: UpdateAppComponent
  },
  {
    path: '**', redirectTo: 'error404',
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
