import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PickListModule } from 'primeng/picklist';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { GalleriaModule } from 'primeng/galleria';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DockModule } from 'primeng/dock';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { SpeedDialModule } from 'primeng/speeddial';

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
    TableModule,
    DialogModule,
    InputTextModule,
    DockModule,
    TooltipModule,
    SkeletonModule,
    SpeedDialModule
  ],
})
export class PrimengModule { }
