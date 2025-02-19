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

  public addItemToCarrusel(movieId: number, position: number, poster_url: string){
    return this.http.post(`${this.baseUrl}/carrusel`, {
      movieId,
      position,
      poster_url,
    })
  }

  public removeItemCarrusel( movieId: number){
    return this.http.delete(`${this.baseUrl}/carrusel/${movieId}`)
  }

  public uploadMoviePoster(formData: FormData) {
    return this.http.post(`${this.baseUrl}/carrusel/upload`, formData);
  }

}
