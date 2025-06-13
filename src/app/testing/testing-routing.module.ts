import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestingComponent } from './components/testing/testing.component';

const routes: Routes = [

  {
    path: '',
    component: TestingComponent
  },
  {
    path: '**',
    redirectTo: '',
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestingRoutingModule { }
