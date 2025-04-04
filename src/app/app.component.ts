import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environments } from '../environments/environments';
import { IUbication } from './common/interfaces';
import { Observable } from 'rxjs';
import { AuthService } from './auth/services/auth.service';
import { Region } from './shared/services/shared.service';
import { Geolocation } from '@capacitor/geolocation';
import { StorageService } from './storage/storage.service';
import PullToRefresh from 'pulltorefreshjs';
import { pullToRefreshCss } from './shared/pages/main-layout/pull-to-refresh-css';
import { StatusBar, Style } from '@capacitor/status-bar';

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
    private storageService: StorageService

  ){}

  ngOnInit(): void {

    StatusBar.setOverlaysWebView({ overlay: false });

    this.getAllRegions().subscribe({
      next: (resp) => {
        this.regions = resp

        this.storageService.saveData("regions", JSON.stringify(this.regions)).subscribe({
          next: () => {
            console.log('Regiones guardadas en el almacenamiento local');
          },
          error: (error) => {
            console.error('Error al guardar regiones:', error);
          }
        })

      },
      error: (error) => {
        console.log(error);
      }
    })

    this.storageService.getData("user_ubication").subscribe(value => {
      if(!value){
        this.getUserLocationANDROID();
      }
    })

    this.authService.checkAuthentication()
    .subscribe( ()=>{
      console.log('CheckAuthentication finished');
      }
    )

  }

  ngAfterViewInit(): void {

    this.ptrInstance = PullToRefresh.init({
      mainElement: '#scrollableContainer',
      instructionsPullToRefresh: 'Desliza para refrescar',
      instructionsReleaseToRefresh: 'Suelta para refrescar',
      instructionsRefreshing: 'Cargando...',
      getStyles: () => {
        return pullToRefreshCss
      },

      onRefresh: async () => {
        window.location.reload();
      }
    })

  }

  ngOnDestroy(): void {

    if (this.ptrInstance) {
      this.ptrInstance.destroy();
    }
  }

  async getUserLocationANDROID() {
    try {
      // 1) Verifica permisos (opcional pero recomendado)
      const permissions = await Geolocation.checkPermissions();
      if (permissions.location === 'denied') {
        // Solicita permiso si está denegado
        await Geolocation.requestPermissions();
      }

      // 2) Obtén la posición actual
      const position = await Geolocation.getCurrentPosition();

      // 3) Extrae lat/lng
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // 4) Llamas a tu API (exactamente como antes)
      this.getUbicationByGeoCode(lat, lng).subscribe(response => {

        // Guarda la ubicación en el almacenamiento local o en la sesión según sea necesario
        this.storageService.saveData("user_ubication", response.address.state).subscribe({
          next: () => {
            console.log('Ubicación guardada en el almacenamiento local', response.address.state);
          },
          error: (error) => {
            console.error('Error al guardar ubicación:', error);
          }
        })

      });

    } catch (error) {
      console.error('Error al obtener ubicación:', error);
    }
  }

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

}
