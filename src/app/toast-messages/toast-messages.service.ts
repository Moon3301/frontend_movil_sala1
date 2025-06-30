import { Injectable } from "@angular/core";
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastMessagesService {

  constructor(private messageService: MessageService) { }

  showToast(summary: string, detail: string, severity: string, life: number = 3000) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
      life: life
    });
  }

}
