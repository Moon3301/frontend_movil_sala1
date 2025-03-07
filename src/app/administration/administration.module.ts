import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ListComponent } from './components/list/list.component';
import { ListMoviesComponent } from './pages/list-movies/list-movies.component';
import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationService } from './services/administration.service';
import { PrimengModule } from '../primeng/primeng.module';
import { AdministrationPageComponent } from './pages/administration-page/administration-page.component';
import { EditCarruselComponent } from './components/edit-carrusel/edit-carrusel.component';
import { UpdateRecordsComponent } from './components/update-records/update-records.component';
import { MatTableModule } from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [
    LayoutPageComponent,
    ListComponent,
    ListMoviesComponent,
    AdministrationPageComponent,
    EditCarruselComponent,
    UpdateRecordsComponent,

  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    PrimengModule,
    MatTableModule,
    MatSelectModule
  ],
  providers: [
    AdministrationService
  ]
})
export class AdministrationModule { }
