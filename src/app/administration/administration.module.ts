import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { PrimengModule } from '../primeng/primeng.module';

import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { AdministrationPageComponent } from './pages/administration-page/administration-page.component';

import { AdministrationService } from './services/administration.service';
import { UpdateRecordsPageComponent } from './pages/update-records-page/update-records-page.component';
import { EditCarruselPageComponent } from './pages/edit-carrusel-page/edit-carrusel-page.component';
import { EditMoviesPagesComponent } from './pages/edit-movies-pages/edit-movies-pages.component';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { TextareaModule } from 'primeng/textarea';

@NgModule({
  declarations: [
    LayoutPageComponent,
    AdministrationPageComponent,
    UpdateRecordsPageComponent,
    EditMoviesPagesComponent,
    EditCarruselPageComponent,

  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    PrimengModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TextareaModule,
  ],
  providers: [
    AdministrationService
  ]
})
export class AdministrationModule { }
