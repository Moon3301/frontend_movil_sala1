import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'billboard',
    loadChildren: () => import ('./billboard/billboard.module').then(m => m.BillboardModule)
  },
  {
    path: 'movies',
    loadChildren: () => import('./movie/movie.module').then( m => m.MovieModule)
  },
  {
    path: 'cinema',
    loadChildren: () => import('./cinema/cinema.module').then( m => m.CinemaModule)
  },
  {
    path: '', redirectTo: 'movies', pathMatch: 'full'
  },
  {
    path: '**', redirectTo: 'movies'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
