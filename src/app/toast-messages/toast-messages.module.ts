import { NgModule } from '@angular/core';
import { ToastMessagesService } from './toast-messages.service';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';

@NgModule({
  imports: [
    MessageModule,
    ToastModule
  ],
  exports: [
    ToastModule,
    MessageModule
  ],
  providers: [
    ToastMessagesService
  ]
})
export class ToastMessagesModule { }
