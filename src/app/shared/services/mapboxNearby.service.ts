import { Injectable } from "@angular/core";
import { map, switchMap } from 'rxjs/operators';
import { environments } from "../../../environments/environments";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Geolocation } from '@capacitor/geolocation';
import { from, Observable } from "rxjs";

export interface CineFeature {
  id: number;
  nombre: string;
  empresa: string;
  distancia: number;            // metros
  lon: number;
  lat: number;
}

@Injectable({
  providedIn: 'root'
})
export class mapBoxNearbyService{

  private readonly token = environments.mapbox.accessToken;
  private readonly tileset = environments.mapbox.tilesetId;

  constructor(private http: HttpClient){}

  /** Devuelve cines ordenados de más cercano a más lejano */
  // getNearby(lon: number, lat: number, radius = 10000, limit = 20) {

  //   const url =
  //   `https://api.mapbox.com/v4/${this.tileset}/` +
  //   `tilequery/${lon},${lat}.json`;

  //   const params = new HttpParams()
  //   .set('access_token', this.token)
  //   .set('radius', radius)     // metros
  //   .set('limit', limit)      // máx 50  :contentReference[oaicite:1]{index=1}
  //   .set('dedup', 'true');   // elimina duplicados

  //   return this.http.get<{ features: any[] }>(url, { params }).pipe(
  //     map(r => {
  //       // 1️⃣ ordenar por distancia
  //       const ordered = r.features.sort(
  //         (a, b) => a.properties.tilequery.distance -
  //                   b.properties.tilequery.distance
  //       );

  //       // 2️⃣ eliminar duplicados por id
  //       const seen = new Set<number>();
  //       const uniques = ordered.filter(f => {
  //         const id = f.properties.id;
  //         if (seen.has(id)) { return false; }
  //         seen.add(id);
  //         return true;
  //       });

  //       // 3️⃣ mapear al modelo
  //       return uniques.map(f => ({
  //         id:        f.properties.id,
  //         nombre:    f.properties.name,
  //         empresa:   f.properties.empresa,
  //         distancia: f.properties.tilequery.distance,
  //         lon:       f.geometry.coordinates[0],
  //         lat:       f.geometry.coordinates[1],
  //       }) as CineFeature);
  //     })
  //   );
  // }


  getNearby(lon: number, lat: number) {
    const url = `https://api.mapbox.com/v4/${this.tileset}/tilequery/${lon},${lat}.json`;
    const params = new HttpParams({fromObject:{
      access_token: environments.mapbox.accessToken,   // pk recomendado
      radius: '100000',


      layers: 'cinemas'
    }});
    return this.http.get<{features:any[]}>(url,{params}).pipe(
      map(r=>r.features.map(f=>f.properties.name))
    );
  }

  getNearby1(lon: number, lat: number,
    radius = 50_000, limit = 30) {

    const url = `https://api.mapbox.com/v4/${this.tileset}` +
            `/tilequery/${lon},${lat}.json`;
    console.log(lon, lat);

    const params = new HttpParams()
    .set('access_token', this.token)
    .set('radius',  radius.toString())
    .set('limit',   limit.toString())
    .set('dedupe',  'true')
    .set('layer', 'cinemas')

    return this.http.get<{ features: any[] }>(url, { params }).pipe(
    map(r => r.features
    .sort((a, b) =>
      a.properties.tilequery.distance -
      b.properties.tilequery.distance
    )
    .map(f => ({
      id:        f.properties.id,
      nombre:    f.properties.name,
      empresa:   f.properties.empresa,
      distancia: f.properties.tilequery.distance,
      lon:       f.geometry.coordinates[0],
      lat:       f.geometry.coordinates[1],
    }) as CineFeature)
    )
  );
}



}
