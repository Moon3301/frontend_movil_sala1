import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PickListModule } from 'primeng/picklist';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { GalleriaModule } from 'primeng/galleria';

@NgModule({
  exports: [
    CommonModule,
    ButtonModule,
    PickListModule,
    ToastModule,
    ProgressSpinnerModule,
    MessageModule,
    CardModule,
    GalleriaModule,
  ],
})
export class PrimengModule { }
