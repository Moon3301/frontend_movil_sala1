import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutPageComponent } from "./pages/layout-page/layout-page.component";
import { ListMoviesComponent } from "./pages/list-movies/list-movies.component";
import { AdministrationPageComponent } from "./pages/administration-page/administration-page.component";

const routes: Routes = [

  {
    path: '',
    component: LayoutPageComponent,
    children: [
      { path: 'adm', component: AdministrationPageComponent },
      { path: '**', redirectTo: 'adm'},

    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
