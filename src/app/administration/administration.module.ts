import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ListComponent } from './components/list/list.component';
import { MaterialModule } from '../material/material.module';
import { ListMoviesComponent } from './pages/list-movies/list-movies.component';
import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationService } from './services/administration.service';


@NgModule({
  declarations: [
    LayoutPageComponent,
    ListComponent,
    ListMoviesComponent,

  ],
  imports: [
    CommonModule,
    MaterialModule,
    AdministrationRoutingModule
  ],
  providers: [
    AdministrationService
  ]
})
export class AdministrationModule { }
