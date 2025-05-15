import { Injectable } from "@angular/core";
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { compare } from 'compare-versions';
import { Browser } from '@capacitor/browser';
import { HttpClient } from "@angular/common/http";
import { environments } from "../../environments/environments";
import { MessageService } from 'primeng/api';
import { Router } from "@angular/router";
import { catchError, first, from, map, of, switchMap, tap } from "rxjs";
import { StorageService } from "../storage/storage.service";

export interface AppVersionDetails {
  platform: string;
  min:string;
  latest:string;
  storeUrl:string;
  note?:string
}

@Injectable({ providedIn:'root' })
export class AppVersionService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private router: Router,
    private storage: StorageService

  ){}

  getVersionDetails(platform: string){
    return this.http.get<AppVersionDetails>(`${environments.baseUrl}/app/version`, { params: { platform }} )
  }

  // app-version.service.ts
  check(): Promise<boolean | undefined> {
    return this.getInfo()                                       // Observable<{ current, platform }>
      .pipe(
        switchMap(({ current, platform }) =>
          this.getVersionDetails(platform).pipe(
            first(),
            tap(resp => this.storage
              .saveData('appDetail', JSON.stringify(resp))
              .pipe(catchError(() => of(null)))                  // ignora error de storage
              .subscribe()
            ),
            map(resp => ({ current, resp }))
          )
        ),
        map(({ current, resp }) => {
          if (compare(current, resp.min, '<')) {
            this.router.navigateByUrl('/updateApp');
            return false;                                        // fuerza update
          }
          if (compare(current, resp.latest, '<')) {
            // this.toastService.info('Nueva versión disponible 📲');
          }
          return true;                                           // ok
        }),
        catchError(err => {
          console.error('[Version] fallo check', err);
          return of(true);                                       // fail-open
        }),
        first(),                                                 // Promise resuelta solo una vez
      )
      .toPromise();
  }

  /* helper */
  private getInfo() {
    return from(App.getInfo()).pipe(
      map(info => ({
        current: info.version,
        platform: Capacitor.getPlatform() as 'android' | 'ios',
      }))
    );
  }


  async checkV2() {
    // ① versión actual
    const info = await App.getInfo();
    const current = info.version;

    // ② plataforma
    const platform = Capacitor.getPlatform() as 'android' | 'ios';

    // ③ endpoint
    const cfg = await this.http
      .get<{min:string;latest:string;storeUrl:string;note?:string}>(
        `${environments.baseUrl}/app/version`,
        { params: { platform } },
      )
      .toPromise();

    if(cfg){

      if (compare(current, cfg.min, '<')) {
        // FORCE UPDATE
        await this.showDialog(cfg.note ?? 'Actualiza Sala 1 para continuar', cfg.storeUrl);
        // bloquea todo lo demás
        return false;
      }

      if (compare(current, cfg.latest, '<')) {
        // Soft update (toast)
        // this.toast.show('Nueva versión disponible…');
      }
    }
    // ④ lógica


    return true;
  }

  private redirectStore(storeUrl:string){

    Browser.open({
      url: storeUrl
    })

  }

  private async showDialog(message: string, storeUrl: string) {

    const alert = await this.messageService.add(
      {
        severity: 'contrast',
        summary: `Redireccionando a `,
        detail: message,
        life:  + 100
      }
    )

    return alert
  }

}
