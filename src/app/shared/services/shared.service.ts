import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { BehaviorSubject, catchError, from, map, Observable, of, pipe, switchMap, tap } from 'rxjs';
import { environments } from '../../../environments/environments';
import { IRegion, IUbication } from "../../common/interfaces";
import stringSimilarity from "string-similarity";
import { StorageService } from "../../storage/storage.service";
import { Geolocation } from '@capacitor/geolocation';
import { Subject } from 'rxjs';
import { ICinema } from "../../movie/interfaces/funciones.interface";

export interface Region {
  id: number,
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class SharedService{

  private _currentRegion = new BehaviorSubject<string | null>(null);
  public currentRegion$: Observable<string | null> = this._currentRegion.asObservable();

  regions: IRegion[] = []
  currentRegion!: string;
  currentRegionSession!: string;
  userCurrentRegion!: string;

  private toggleDrawerSubject = new Subject<void>();
  toggleDrawer$ = this.toggleDrawerSubject.asObservable();

  private nameOptionFilter$ = new BehaviorSubject<string | null>(null);
  selectedNameFilter$ = this.nameOptionFilter$.asObservable();

  private iconOptionFilter$ = new BehaviorSubject<string | null>(null);
  selectedIconFilter$ = this.iconOptionFilter$.asObservable();

  private baseUrl: string = environments.baseUrl;

  constructor(private http: HttpClient, private storageService: StorageService) {}

  public getAllRegions(): Observable<IRegion[]>{
    return this.http.get<IRegion[]>(`${this.baseUrl}/region`)
  }

  getChainsByRegion(regionId: number) {
    return this.http.get<string[]>(`${this.baseUrl}/ubication/chains-by-region?regionId=${regionId}`);
  }

  getCinesByChainAndRegion(chain: string, regionId: number) {
    return this.http.get<ICinema[]>(`${this.baseUrl}/ubication/cines-by-chain-and-region?chain=${chain}&regionId=${regionId}`);
  }

  setNameOptionFilter(region: string){
    this.nameOptionFilter$.next(region);
  }

  setIconOptionFilter(icon: string){
    this.iconOptionFilter$.next(icon);
  }

  setNameIconOptionFilter(name: string, icon: string){
    this.nameOptionFilter$.next(name);
    this.iconOptionFilter$.next(icon);
  }

  get getNameOptionFilter(){
    return this.nameOptionFilter$.value;
  }

  get getIconOptionFilter(){
    return this.iconOptionFilter$.value;
  }

  get currentUserRegion(){
    return this.userCurrentRegion;
  }

  get allRegionsDEPRECATED(): Region[]{
    return localStorage.getItem("regions") ? JSON.parse(localStorage.getItem("regions")!) : []
  }

  public get allRegions(): Observable<IRegion[]>{
    return this.storageService.getData('regions').pipe(

      map(value => {
        return value ? JSON.parse(value) as IRegion[]: []
      })
    )
  }

  public getUbicationByGeoCode(lat: number, lng: number): Observable<IUbication>{
    return this.http.get<IUbication>(`${environments.urlGeoCode}reverse?lat=${lat}&lon=${lng}&api_key=${environments.apiKeyGeoCode}`)
  }

  getUbicationByServer(lat: string, lng: string): Observable<IRegion>{
    return this.http.get<IRegion>(`${environments.baseUrl}/ubication/coordenates?latitude=${lat}&longitude=${lng}`)
  }


  getUserLocation(): Observable<string> {
    // Convertir geolocalización a Observable
    return from(Geolocation.getCurrentPosition()).pipe(
      // Con el resultado, obtener la dirección invertida
      switchMap(position =>
        this.getUbicationByServer(position.coords.latitude.toString(), position.coords.longitude.toString())
      ),
      // Con la dirección, ahora obtener la lista de regiones y transformarla
      switchMap(response => {
        return this.allRegions.pipe(
          map(regions => {
            const allRegionsName = regions.map(r => r.name);
            return this.findSimilarityRegion(allRegionsName, response.name);
          })
        );
      }),
      // Al final, ya tenemos el `similarRegion` como string que se emite a quien se suscriba
    );
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

          return this.getUbicationByServer(lat.toString(), lng.toString());
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
          this.setRegion(saved!);
        }),
        catchError(err => {
          console.error('Error al obtener ubicación:', err);

          // === AQUÍ asignamos el valor por defecto ===
          return this.storageService.saveData('user_ubication', DEFAULT_LOCATION).pipe(
            tap(() => {
              console.log('Ubicación guardada por defecto:', DEFAULT_LOCATION);
              this.setRegion(DEFAULT_LOCATION);
            }),
            // Devolvemos algo para que el flujo continúe y no rompa
            // Por ejemplo, devolvemos un string con la ubicación por defecto
            map(() => DEFAULT_LOCATION)
          );
        })
      );
    }


  findSimilarityRegion(array: string[], value: string): string {

    const result = stringSimilarity.findBestMatch(value!, array);

    const bestMatch = result.bestMatch;
    return bestMatch.target;

  }

  toggleDrawer(): void {
    this.toggleDrawerSubject.next();
  }

  setRegion(region: string) {
    this._currentRegion.next(region);
  }

  getRegionValue(): string | null {
    return this._currentRegion.value;
  }



}
