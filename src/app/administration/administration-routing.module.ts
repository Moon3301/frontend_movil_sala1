import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutPageComponent } from "./pages/layout-page/layout-page.component";
import { ListMoviesComponent } from "./pages/list-movies/list-movies.component";

const routes: Routes = [

  {
    path: '',
    component: LayoutPageComponent,
    children: [
      { path: 'list-movies', component: ListMoviesComponent},
      { path: '**', redirectTo: 'list-movies' }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
