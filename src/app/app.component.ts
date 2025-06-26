import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { environments } from '../environments/environments';
import { IRegion } from './common/interfaces';
import { catchError, first, firstValueFrom, forkJoin, from, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { AuthService } from './auth/services/auth.service';
import { Region, SharedService } from './shared/services/shared.service';
import { Geolocation } from '@capacitor/geolocation';
import { StorageService } from './storage/storage.service';
import { StatusBar } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';
import { AdvertisingId } from '@capacitor-community/advertising-id';
import { MatDrawer } from '@angular/material/sidenav';
import { PushNotifications } from '@capacitor/push-notifications';

import {
  AppTrackingTransparency,
  type AppTrackingStatusResponse
} from 'capacitor-plugin-app-tracking-transparency';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})

export class AppComponent implements OnInit, AfterViewInit {

  regions: Region[] = []

  ptrInstance: any;

  @ViewChild('drawer') drawer!: MatDrawer;

  window: any;

  private destroy$ = new Subject<void>();

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    private storageService: StorageService,
    private sharedService: SharedService,

  ){}

  async ngAfterViewInit() {
    // esperamos al primer repintado para no bloquear el splash
    requestAnimationFrame(() => this.bootstrapAsync());
  }

  private async bootstrapAsync() {
    try {
      await this.askATT();
      await this.ensurePermissions();   // pide push + localización con timeout
      await firstValueFrom(this.initData$())
      await this.initSdkAppsFlyer();
    } catch (err) {
      console.error('[BOOT]', err);
    }
  }

  async ngOnInit(){

    if(Capacitor.getPlatform() === 'ios'){
      StatusBar.setOverlaysWebView({ overlay: false });
    }

    if (Capacitor.getPlatform() === 'android') {
      EdgeToEdge.setBackgroundColor({ color: '#000000' });
    }

  }

  private initData$(): Observable<void> {
    return this.getAllRegions().pipe(
      tap(regs =>
        this.storageService.saveData('regions', JSON.stringify(regs)).subscribe()
      ),
      switchMap(() => this.storageService.getData('user_region_id')),
      switchMap(regionId =>
        regionId
          ? of(regionId)                     // ya persistido, nada que hacer
          : this.setRegionFromCoords$()      // usa coords que guardó ensurePermissions()
      ),
      switchMap(() => this.authService.checkAuthentication()),
      map(() => void 0)                      // <- para que devuelva Observable<void>
    );
  }

  private setRegionFromCoords$(): Observable<void> {
    return this.storageService.getData('coordenates').pipe(
      switchMap(value => {
        if (!value) return of(null);     // sin coords → ubicación por defecto
        const { latitude, longitude } = JSON.parse(value);
        return this.sharedService.getUbicationByServer(
          latitude.toString(),
          longitude.toString()
        );
      }),
      switchMap(region => {
        const fallback = { id: 0, name: 'Seleccione una región' };
        const r = region ?? fallback;

        return forkJoin([
          this.storageService.saveData('user_region_id', String(r.id)),
          this.storageService.saveData('user_ubication', r.name)
        ]).pipe(
          tap(() => {
            this.sharedService.setRegion(r.name);
            this.sharedService.setNameIconOptionFilter(r.name, 'location_on');
          })
        );
      }),
      map(() => void 0)
    );
  }

  /* -------- ATT ---------- */
  private async askATT(): Promise<void> {
    if (Capacitor.getPlatform() !== 'ios') return;           // sólo iOS/iPadOS

    const { status } = await AppTrackingTransparency.getStatus();
    if (status === 'notDetermined') {
      // espera al primer frame para evitar que se oculte tras el splash
      await new Promise(r => requestAnimationFrame(r));

      const res: AppTrackingStatusResponse =
        await AppTrackingTransparency.requestPermission();

      console.log('[ATT] result:', res.status); // authorized | denied | ...
    }
  }

  private async ensurePermissions() {
    /* --- push notifications --- */
    const pushPerm = await PushNotifications.checkPermissions();
    if (pushPerm.receive === 'prompt') {
      await PushNotifications.requestPermissions();
    }

    /* --- localización --- */
    let locPerm = await Geolocation.checkPermissions();
    if (locPerm.location === 'denied') {
      locPerm = await Geolocation.requestPermissions();
    }
    if (locPerm.location !== 'granted') {
      await firstValueFrom(
        this.storageService.saveData('user_ubication', 'Seleccione una ubicacion'),
      )
      return;   // seguimos sin petar la app
    }

    const pos = await Geolocation.getCurrentPosition({ timeout: 8000 });
    const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
    await firstValueFrom(
      this.storageService.saveData('coordenates', JSON.stringify(coords))
    )
  }

  getAllRegions(): Observable<IRegion[]>{
    return this.http.get<IRegion[]>(`${environments.baseUrl}/region`)
  }

  getUserLocationANDROID() {
    const DEFAULT_LOCATION = ''; // El valor por defecto que desees

    return from(Geolocation.checkPermissions()).pipe(
      switchMap(permissions => {
        if (permissions.location === 'denied') {
          // El usuario no otorgó permiso aún: se solicita
          return from(Geolocation.requestPermissions());
        }
        return of(null);
      }),
      switchMap(() => from(Geolocation.getCurrentPosition())),
      switchMap((position) => {
        const { latitude: lat, longitude: lng } = position.coords;

        // Llamada a la API que, dado lat/lng, devuelve un Observable con la ubicación

        return this.sharedService.getUbicationByServer(lat.toString(), lng.toString());
      }),
      switchMap(response => {
        console.log('Ubicación obtenida: 17-06',response)

      this.storageService.getData("filterDataName").subscribe({
        next: (resp) => {
          console.log('Resp', resp)
          if(resp!= null){
            this.sharedService.setNameOptionFilter(resp)
          }else{
            console.log(response.name)
            this.storageService.saveData("filterDataName", response.name).subscribe()
            this.sharedService.setNameOptionFilter(response.name)
          }
        }
      })

      this.storageService.getData("filterDataIcon").subscribe({
        next: (resp) => {
          if(resp!= null){
            this.sharedService.setIconOptionFilter(resp)
          }else{
            this.storageService.saveData("filterDataIcon", 'location_on').subscribe()
            this.sharedService.setIconOptionFilter('location_on')
          }
        }
      })

      this.storageService.saveData("user_region_id", response.id.toString()).subscribe()

      // Guardar la ubicación real en storage
      return this.storageService.saveData('user_ubication', response.name).pipe(
        // Encadena y retorna la ubicación guardada
        switchMap(() => this.storageService.getData('user_ubication'))
      );


      }),
      tap(saved => {
        console.log('Ubicación guardada en el almacenamiento local:', saved);
        // A la vez, actualizamos BehaviorSubject o tu service
        this.sharedService.setRegion(saved!);
      }),
      catchError(err => {
        console.error('Error al obtener ubicación:', err);

        // === AQUÍ asignamos el valor por defecto ===
        return this.storageService.saveData('user_ubication', DEFAULT_LOCATION).pipe(
          tap(() => {
            console.log('Ubicación guardada por defecto:', DEFAULT_LOCATION);
            this.sharedService.setRegion(DEFAULT_LOCATION);
          }),
          // Devolvemos algo para que el flujo continúe y no rompa
          // Por ejemplo, devolvemos un string con la ubicación por defecto
          map(() => DEFAULT_LOCATION)
        );
      })
    );
  }

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

    if (this.ptrInstance) {
      this.ptrInstance.destroy();
    }
  }

  async initSdkAppsFlyer() {

    // — (iOS) recoge la IDFA sólo si el usuario la autorizó —
    if (Capacitor.getPlatform() === 'ios') {
      const { id, status } = await AdvertisingId.getAdvertisingId();
      console.log('[AdvertisingId] ID:', id, 'Status:', status);
    }

    const opts: any = {
      devKey:   environments.appsFlyerDevKey,
      appId:    environments.appleAppId,
      isDebug:  environments.isDebug,
      onInstallConversionDataListener:
                environments.onInstallConversionDataListener
    };

    const { Appsflyer } =
      await import('@awesome-cordova-plugins/appsflyer/ngx');

    new Appsflyer()
      .initSdk(opts)
      .then(res  => console.log('[AF] OK', res))
      .catch(err => console.error('[AF] ERROR', err));
  }

  async getUserLocationWEB(){

    navigator.geolocation.getCurrentPosition(
      (position)=> {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        this.sharedService.getUbicationByServer(lat.toString(), lng.toString()).subscribe(response => {
          sessionStorage.setItem("user_ubication",response.name)
        })
      }
    )
  }

}

