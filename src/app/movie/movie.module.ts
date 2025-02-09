import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './components/card/card.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { MoviePageComponent } from './pages/movie-page/movie-page.component';
import { MaterialModule } from '../material/material.module';
import { MovieRoutingModule } from './movie-routing.module';
import { ListMoviePageComponent } from './pages/list-movie-page/list-movie-page.component';
import { ExpansionPanelComponent } from './components/expansion-panel/expansion-panel.component';
import { CardVideoComponent } from './components/card-video/card-video.component';


@NgModule({
  declarations: [
    CardComponent,
    LayoutPageComponent,
    MoviePageComponent,
    ListMoviePageComponent,

  ],
  imports: [
    CommonModule,
    MovieRoutingModule,
    MaterialModule
  ]
})
export class MovieModule { }
