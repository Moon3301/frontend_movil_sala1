import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { MovieCarrusel, UploadMoviePosterResponse } from '../interfaces/movies.interface';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  baseUrl = environments.baseUrl

  constructor(private readonly http: HttpClient) { }

  public getMovieCarrusel(): Observable<any>{
    return this.http.get<any[]>(`${this.baseUrl}/carrusel/movieCarrusel`)
  }

  public updateManualScreenType(movieId: number, screenType: string){
    return this.http.post<any>(`${this.baseUrl}/movies/update-screen-type`, {
      movieId,
      screenType
    })
  }

  public updateImgUrl(movieId: number, imgUrl: string){
    return this.http.post<any>(`${this.baseUrl}/movies/update-movie-url`,{
      movieId,
      imgUrl
    })
  }

  public getAllMovies(){
    return this.http.get<any[]>(`${this.baseUrl}/movies`)
  }

  public addItemToCarrusel(external_id: string, position: number, poster_url: string){
    return this.http.post(`${this.baseUrl}/carrusel`, {
      external_id,
      position,
      poster_url,
    })
  }

  public removeItemCarrusel( movieId: number){
    return this.http.delete(`${this.baseUrl}/carrusel/${movieId}`)
  }

  public updatePosterPosition(id: number, newPosition: number): Observable<MovieCarrusel[]>{
    return this.http.post<MovieCarrusel[]>(`${this.baseUrl}/carrusel/update-position`, { id, newPosition });
  }

  reorderCarrusel(body: { posters: {id: number}[] }): Observable<{ data: MovieCarrusel[] }> {
    return this.http.put<{ data: MovieCarrusel[] }>(`${this.baseUrl}/carrusel/reorder`, body);
  }

  public uploadMoviePoster(formData: FormData) {
    return this.http.post<UploadMoviePosterResponse>(`${this.baseUrl}/carrusel/upload`, formData);
  }

  public updateRecordsCinemark(){
    return this.http.post(`${this.baseUrl}/data-loader/cinemark`, {})
  }

  public updateRecordsCinepolis(){
    return this.http.post(`${this.baseUrl}/data-loader/cinepolis`, {})
  }

  public updateRecordsCineplanet(){
    return this.http.post(`${this.baseUrl}/data-loader/cineplanet`, {})
  }

}
