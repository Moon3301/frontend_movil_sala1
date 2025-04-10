import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './components/card/card.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { MoviePageComponent } from './pages/movie-page/movie-page.component';
import { MaterialModule } from '../material/material.module';
import { MovieRoutingModule } from './movie-routing.module';
import { ListMoviePageComponent } from './pages/list-movie-page/list-movie-page.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { CarruselComponent } from './components/carrusel/carrusel.component';
import { ListPremiereComponent } from './components/list-premiere/list-premiere.component';
import { PrimengModule } from '../primeng/primeng.module';
import { HeaderComponent } from './components/header/header.component';
import Swiper from 'swiper/core'

@NgModule({
  declarations: [
    CardComponent,
    LayoutPageComponent,
    MoviePageComponent,
    ListMoviePageComponent,
    SearchBoxComponent,
    CarruselComponent,
    ListPremiereComponent,
    HeaderComponent,

  ],
  imports: [
    CommonModule,
    MovieRoutingModule,
    MaterialModule,
    PrimengModule,
    SharedModule,
    ReactiveFormsModule,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MovieModule { }
