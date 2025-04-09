import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environments } from '../environments/environments';
import { IUbication } from './common/interfaces';
import { catchError, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { AuthService } from './auth/services/auth.service';
import { Region, SharedService } from './shared/services/shared.service';
import { Geolocation } from '@capacitor/geolocation';
import { StorageService } from './storage/storage.service';
import PullToRefresh from 'pulltorefreshjs';
import { pullToRefreshCss } from './shared/pages/main-layout/pull-to-refresh-css';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})

export class AppComponent implements OnInit{

  regions: Region[] = []

  ptrInstance: any;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    private storageService: StorageService,
    private sharedService: SharedService,

  ){}

  ngOnInit(): void {

    if(Capacitor.getPlatform() === 'ios'){
      // document.body.classList.add('ios-device');
      StatusBar.setOverlaysWebView({ overlay: false });
    }



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

    // this.storageService.getData("user_ubication").subscribe(value => {
    //   if(!value){
    //     this.getUserLocationANDROID();
    //   }
    // })

    // this.authService.checkAuthentication()
    // .subscribe( ()=>{
    //   console.log('CheckAuthentication finished');
    //   }
    // )

  }

  getUserLocationANDROID() {
    const DEFAULT_LOCATION = 'Metropolitana de Santiago'; // El valor por defecto que desees

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
        return this.getUbicationByGeoCode(lat, lng);
      }),
      switchMap(response => {
        // Guardar la ubicación real en storage
        return this.storageService.saveData('user_ubication', response.address.state).pipe(
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


  // async getUserLocationANDROID() {
  //   try {
  //     // 1) Verifica permisos (opcional pero recomendado)
  //     const permissions = await Geolocation.checkPermissions();
  //     if (permissions.location === 'denied') {
  //       // Solicita permiso si está denegado
  //       await Geolocation.requestPermissions();
  //     }

  //     // 2) Obtén la posición actual
  //     const position = await Geolocation.getCurrentPosition();

  //     // 3) Extrae lat/lng
  //     const lat = position.coords.latitude;
  //     const lng = position.coords.longitude;

  //     // 4) Llamas a tu API (exactamente como antes)
  //     this.getUbicationByGeoCode(lat, lng).subscribe(response => {

  //       // Guarda la ubicación en el almacenamiento local o en la sesión según sea necesario
  //       this.storageService.saveData("user_ubication", response.address.state).pipe(
  //         switchMap(() => {
  //           // Una vez guardado, obtén la ubicación
  //           return this.storageService.getData('user_ubication');
  //         })
  //       ).subscribe({
  //         next: (resp) => {
  //           console.log('Ubicación guardada en el almacenamiento local', response.address.state);
  //         },
  //         error: (error) => {
  //           console.error('Error al guardar ubicación:', error);
  //         }
  //       })

  //     });

  //   } catch (error) {
  //     console.error('Error al obtener ubicación:', error);
  //   }
  // }

  async getUserLocationWEB(){

    navigator.geolocation.getCurrentPosition(
      (position)=> {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        this.getUbicationByGeoCode(lat, lng).subscribe(response => {
          sessionStorage.setItem("user_ubication",response.address.state)
        })
      }
    )
  }

  getUbicationByGeoCode(lat: number, lng: number): Observable<IUbication>{
    return this.http.get<IUbication>(`${environments.urlGeoCode}reverse?lat=${lat}&lon=${lng}&api_key=${environments.apiKeyGeoCode}`)
  }

  getAllRegions(): Observable<Region[]>{
    return this.http.get<Region[]>(`${environments.baseUrl}/region`)
  }

  ngOnDestroy(): void {

    if (this.ptrInstance) {
      this.ptrInstance.destroy();
    }
  }


}
