import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  baseUrl = environments.baseUrl

  constructor(private readonly http: HttpClient) { }

  public getMovieCarrusel(): Observable<any>{
    return this.http.get<any[]>(`${this.baseUrl}/carrusel/movieCarrusel`)
  }

  public addItemToCarrusel(movieId: number, position: number){
    return this.http.post(`${this.baseUrl}/carrusel`, {
      movieId,
      position
    })
  }

  public removeItemCarrusel( movieId: number){
    return this.http.delete(`${this.baseUrl}/carrusel/${movieId}`)
  }

}
