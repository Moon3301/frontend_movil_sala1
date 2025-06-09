import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutPageComponent } from "./pages/layout-page/layout-page.component";

import { AdministrationPageComponent } from "./pages/administration-page/administration-page.component";

import { EditCarruselPageComponent } from "./pages/edit-carrusel-page/edit-carrusel-page.component";
import { EditMoviesPagesComponent } from "./pages/edit-movies-pages/edit-movies-pages.component";
import { UpdateRecordsPageComponent } from "./pages/update-records-page/update-records-page.component";

const routes: Routes = [

  {
    path: '',
    component: LayoutPageComponent,
  },
  {
    path: 'adm',
    component: AdministrationPageComponent, 
  },
  {
    path: 'edit-carrusel',
    component: EditCarruselPageComponent,
  },
  {
    path: 'edit-movies',
    component: EditMoviesPagesComponent,
  },
  {
    path: 'update-records',
    component: UpdateRecordsPageComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
