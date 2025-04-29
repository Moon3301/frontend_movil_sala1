import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StorageService } from '../../../storage/storage.service';
import { Region, SharedService } from '../../../shared/services/shared.service';
import * as stringSimilarity from 'string-similarity';
import { Capacitor } from '@capacitor/core';
import { IRegion } from '../../../common/interfaces';
import { catchError, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'movie-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  readonly isAndroid = Capacitor.getPlatform() === 'android';

  regions: IRegion[] = []

  userCurrentRegion!: string;

  constructor(
    private storageService: StorageService,
    private cdr: ChangeDetectorRef,
    private sharedService: SharedService

  ){}

  ngOnInit(): void {

    this.sharedService.currentRegion$.subscribe(region => {
      this.userCurrentRegion = region!;
      this.cdr.detectChanges();  // Si usas OnPush, forzar actualización
    });

    // Se obtiene y actualiza la ubicacion actual del usuario
    this.storageService.getData("user_ubication").subscribe({
      next: (resp)=> {
        this.userCurrentRegion = resp!

        if (!this.userCurrentRegion){

          this.sharedService.getUserLocation().subscribe({
            next: (resp) => {
              console.log(resp)
              this.userCurrentRegion = resp
              this.cdr.detectChanges();
              //sessionStorage.setItem("user_ubication", resp)
            },
            error: (error) => {
              console.log(error);
            }
          })
        }
      },
      error: (error)=> {
        console.log(error);
      }
    })

    // Se actualizan las regiones
    this.sharedService.allRegions.subscribe({
      next: (resp)=> {
        this.regions = resp
      },
      error: (error)=> {
        console.log('No se logro actualizar las regiones', error);
      }
    })

    this.cdr.detectChanges();

  }

  onChangeUbication(newUbication: IRegion): void {

    this.storageService.saveData("user_ubication", newUbication.name).subscribe({
      next: ()=> {
        this.userCurrentRegion = newUbication!.name
        this.sharedService.setRegion(newUbication.name);

        const coordenates = {
          latitude: newUbication.latitude,
          longitude: newUbication.longitude
        }

        this.storageService.saveData('coordenates', JSON.stringify(coordenates)).subscribe({
          next: () => console.log('Coordenadas guardadas en el almacenamiento local'),
          error: (error) => console.error('Error al guardar coordenadas:', error)
        })

        // console.log('Ubicacion actualizada correctamente');
      },
      error: ()=> {
        console.log('La ubicacion no pudo actualizarse correctamente');
      }
    })

    this.cdr.detectChanges();

    const regionsName = this.regions.map( region => region.name);

    this.storageService.getData("user_ubication").subscribe({
      next: (resp)=> {

        const currentRegionSession = resp

        const result = stringSimilarity.findBestMatch(currentRegionSession!, regionsName);
        const bestMatch = result.bestMatch;

        this.userCurrentRegion = bestMatch.target;

        this.cdr.detectChanges();
      },
      error: (error)=> {
        console.log(error);
      }
    })

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

        const coordenates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }

        this.storageService.saveData('coordenates', JSON.stringify(coordenates)).subscribe({
          next: () => console.log('Coordenadas guardadas en el almacenamiento local'),
          error: (error) => console.error('Error al guardar coordenadas:', error)
        })

        return this.sharedService.getUbicationByServer(lat.toString(), lng.toString());
      }),
      switchMap(response => {
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

  onToggleDrawer(): void {
    this.sharedService.toggleDrawer();
  }


}
