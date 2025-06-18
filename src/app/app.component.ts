import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { environments } from '../environments/environments';
import { IRegion } from './common/interfaces';
import { catchError, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { AuthService } from './auth/services/auth.service';
import { Region, SharedService } from './shared/services/shared.service';
import { Geolocation } from '@capacitor/geolocation';
import { StorageService } from './storage/storage.service';
import { StatusBar } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';
import { AdvertisingId } from '@capacitor-community/advertising-id';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})

export class AppComponent implements OnInit{

  regions: Region[] = []

  ptrInstance: any;

  @ViewChild('drawer') drawer!: MatDrawer;

  window: any;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    private storageService: StorageService,
    private sharedService: SharedService,

  ){}

  async ngOnInit(){

    if(Capacitor.getPlatform() === 'ios'){
      StatusBar.setOverlaysWebView({ overlay: false });
    }

    if (Capacitor.getPlatform() === 'android') {
      EdgeToEdge.setBackgroundColor({ color: '#000000' });
    }

    Geolocation.getCurrentPosition().then((position) => {

      const coordenates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }

      this.storageService.saveData('coordenates', JSON.stringify(coordenates)).subscribe({
        next: () => console.log('Coordenadas guardadas en el almacenamiento local'),
        error: (error) => console.error('Error al guardar coordenadas:', error)
      })

    })

    this.getAllRegions().pipe(

      tap(resp => this.regions = resp),
      switchMap(regions => this.storageService.saveData('regions', JSON.stringify(regions))),
      tap(() => console.log('Regiones guardadas en el almacenamiento local')),

      // Llama a la función que retorna un Observable de la ubicación
      switchMap(() => this.getUserLocationANDROID()),
      tap(() => {
        console.log('Ubicación obtenida y guardada')

        // Neesito almacenar un valor por defecto si el usuario no permite el acceso a la ubicacion
      }

    ),

      switchMap(() => this.authService.checkAuthentication()),
      tap(() => console.log('CheckAuthentication finished')),

      catchError(err => {
        console.error('Error en la inicialización:', err);
        return of(null); // Evita que el Observable se rompa
      })
    ).subscribe();

    // if(Capacitor.getPlatform() !== 'web'){

    //   if(Capacitor.getPlatform() === 'ios'){

    //     document.addEventListener('deviceready', async () => {

    //       // 1. Pide permiso al usuario
    //       const { value: status } = await AdvertisingId.requestTracking();
    //       console.log('[ATT] Estado:', status);  // 'Authorized' | 'Denied' | 'Restricted' | 'Not Determined'

    //       // 2. Lee el identificador (IDFA) — devuelve '00000000-…' si no está autorizado
    //       const { id, status: postStatus } = await AdvertisingId.getAdvertisingId();
    //       console.log('[AdvertisingId] ID:', id, 'Status:', postStatus);
    //     });
    //   }

    //   console.log('Iniciando SDK AppsFlyer')
    //   this.initSdkAppsFlyer();
    // }

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

  getAllRegions(): Observable<IRegion[]>{
    return this.http.get<IRegion[]>(`${environments.baseUrl}/region`)
  }

  ngOnDestroy(): void {

    if (this.ptrInstance) {
      this.ptrInstance.destroy();
    }
  }

  async initSdkAppsFlyer(){

    await AdvertisingId.requestTracking();

    const opts: any = {
      devKey:   environments.appsFlyerDevKey,
      appId:    environments.appleAppId,
      isDebug: environments.isDebug,
      onInstallConversionDataListener: environments.onInstallConversionDataListener
    };

    const { Appsflyer } = await import('@awesome-cordova-plugins/appsflyer/ngx');

    const af = new Appsflyer()

    af.initSdk(opts)
      .then((res: any) => console.log('[AF] OK', res))
      .catch((err: any) => console.error('[AF] ERROR', err));

  }

}
