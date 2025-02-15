import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ListComponent } from './components/list/list.component';
import { ListMoviesComponent } from './pages/list-movies/list-movies.component';
import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationService } from './services/administration.service';
import { PrimengModule } from '../primeng/primeng.module';

@NgModule({
  declarations: [
    LayoutPageComponent,
    ListComponent,
    ListMoviesComponent,

  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    PrimengModule
  ],
  providers: [
    AdministrationService
  ]
})
export class AdministrationModule { }
