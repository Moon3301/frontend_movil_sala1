import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { MoviePageComponent } from './pages/movie-page/movie-page.component';
import { ListMoviePageComponent } from './pages/list-movie-page/list-movie-page.component';

const routes: Routes = [

  {
    path: '',
    component: LayoutPageComponent,
    children: [
      { path: 'list', component: ListMoviePageComponent },
      { path: ':id', component: MoviePageComponent },
      { path: '**', redirectTo: 'list' }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovieRoutingModule { }
