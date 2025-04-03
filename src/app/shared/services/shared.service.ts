import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { from, map, Observable, of, pipe, switchMap } from 'rxjs';
import { environments } from '../../../environments/environments';
import { IUbication } from "../../common/interfaces";
import stringSimilarity from "string-similarity";
import { StorageService } from "../../storage/storage.service";
import { Geolocation } from '@capacitor/geolocation';
import { Subject } from 'rxjs';

export interface Region {
  id: number,
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class SharedService{

  regions: Region[] = []
  currentRegion!: string;
  currentRegionSession!: string;
  userCurrentRegion!: string;

  private toggleDrawerSubject = new Subject<void>();
  toggleDrawer$ = this.toggleDrawerSubject.asObservable();

  private baseUrl: string = environments.baseUrl;

  constructor(private http: HttpClient, private storageService: StorageService) {}

  public getAllRegions(): Observable<Region[]>{
    return this.http.get<Region[]>(`${this.baseUrl}/region`)
  }

  public get currentUserRegion(){
    return this.userCurrentRegion;
  }

  public get allRegionsDEPRECATED(): Region[]{
    return localStorage.getItem("regions") ? JSON.parse(localStorage.getItem("regions")!) : []
  }

  public get allRegions(): Observable<Region[]>{
    return this.storageService.getData('regions').pipe(

      map(value => {
        return value ? JSON.parse(value) as Region[]: []
      })
    )
  }

  public getUbicationByGeoCode(lat: number, lng: number): Observable<IUbication>{
    return this.http.get<IUbication>(`${environments.urlGeoCode}reverse?lat=${lat}&lon=${lng}&api_key=${environments.apiKeyGeoCode}`)
  }

  getUserLocation(): Observable<string> {
    // Convertir geolocalización a Observable
    return from(Geolocation.getCurrentPosition()).pipe(
      // Con el resultado, obtener la dirección invertida
      switchMap(position =>
        this.getUbicationByGeoCode(position.coords.latitude, position.coords.longitude)
      ),
      // Con la dirección, ahora obtener la lista de regiones y transformarla
      switchMap(response => {
        return this.allRegions.pipe(
          map(regions => {
            const allRegionsName = regions.map(r => r.name);
            return this.findSimilarityRegion(allRegionsName, response.address.state);
          })
        );
      }),
      // Al final, ya tenemos el `similarRegion` como string que se emite a quien se suscriba
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

}
