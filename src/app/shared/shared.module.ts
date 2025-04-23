import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './components/menu/menu.component';
import { MaterialModule } from '../material/material.module';
import { Error404PageComponent } from './pages/error404-page/error404-page.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { PrimengModule } from '../primeng/primeng.module';
import { SharedService } from './services/shared.service';
import { mapBoxNearbyService } from './services/mapboxNearby.service';

@NgModule({
  providers:[
    SharedService,
    mapBoxNearbyService

  ],
  declarations: [
    MenuComponent,
    Error404PageComponent,
    MainLayoutComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    PrimengModule,
    RouterModule
  ],
  exports:[
    MenuComponent,
    MainLayoutComponent
  ]
})
export class SharedModule { }
