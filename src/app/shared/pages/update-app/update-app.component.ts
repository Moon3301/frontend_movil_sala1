import { Component, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { StorageService } from '../../../storage/storage.service';
import { AppVersionDetails } from '../../../core/appVersion.service';

@Component({
  selector: 'app-update-app',
  standalone: false,
  templateUrl: './update-app.component.html',
  styleUrl: './update-app.component.css'
})
export class UpdateAppComponent implements OnInit{

  storeUrl: string = ''

  constructor(private readonly storageService: StorageService){}

  ngOnInit(): void {

    this.storageService.getData('appDetail').subscribe({
      next: (resp) => {
        const appDetail: AppVersionDetails = JSON.parse(resp!)
        this.storeUrl = appDetail.storeUrl;
      },
      error: (err) => {
        console.log('No se encontro el objeto version details', err);
      }
    })

  }

  async update() {
    await Browser.open({ url: this.storeUrl });
  }

  exit() {
    App.exitApp();
  }

}
