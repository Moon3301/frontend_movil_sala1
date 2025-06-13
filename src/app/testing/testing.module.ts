import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestingComponent } from './components/testing/testing.component';
import { TestingRoutingModule } from './testing-routing.module';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [
    TestingComponent
  ],
  imports: [
    CommonModule,
    TestingRoutingModule,
    MaterialModule
  ],
  providers: [

  ],
})
export class TestingModule { }
