import { Injectable } from '@angular/core';
import { Movie } from '../interfaces/movie.interface';
import { map, Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environments } from '../../../environments/environments';
import { DataBillboard, ICines } from '../interfaces/funciones.interface';
import { getFormattedDate } from '../../common/helpers';
import { MovieCarrusel } from '../../administration/interfaces/movies.interface';
import { IUbication } from '../../common/interfaces';
import { StorageService } from '../../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private baseUrl: string = environments.baseUrl;

  movies: Movie[] = []

  constructor(private http: HttpClient, private storageService: StorageService) {}

  public getBillboards( movieId: number): Observable<ICines[]>{
    return this.http.post<ICines[]>(`${this.baseUrl}/billboard`, { movieId: movieId } )
  }

  public getCinemasByUbicationAndMovie( movieId: number, lat: string, lng: string, currentDate?: string): Observable<any>{
    return this.http.get<any>(
      `${this.baseUrl}/billboard/${currentDate}/v2?movieId=${movieId}&lat=${lat}&lng=${lng}`
    )
  }

  public getFilterBillboards(movieId: number, lat: string, lng: string, currentDate?: string, regionId?: number, chain?: string, cinemaId?: number, filter?: string): Observable<any>{
    console.log(regionId, chain, cinemaId, filter);
    return this.http.get<any>(
      `${this.baseUrl}/billboard/${currentDate}/v3?movieId=${movieId}&lat=${lat}&lng=${lng}&regionId=${regionId}&chain=${chain}&cinemaId=${cinemaId}&filter=${filter}`
    )
  }

  public getMovieByIdLocal( movieId: number): Observable<Movie>{

    return this.storageService.getData('movies').pipe(
      map(value => {
        // `value` será un string con el JSON o null si no existe la clave
        const movies: Movie[] = value ? JSON.parse(value) : [];
        const movie = movies.find(m => m.id === movieId);
        // Retornamos la película (puede ser undefined si no existe)
        return movie!;
      })
    );
  }

  public getMovies(): Observable<Movie[]>{
    return this.http.get<Movie[]>(`${this.baseUrl}/movies`)
  }

  getMoviesByFilters(
    regionId?: number | null,
    chain?: string | null,
    cinemaId?: number | null
  ): Observable<Movie[]> {

    let params = new HttpParams();
    if (regionId != null) params = params.set('regionId', regionId);
    if (chain && chain.trim()) params = params.set('chain', chain);
    if (cinemaId != null) params = params.set('cinemaId', cinemaId);

    return this.http.get<Movie[]>(`${this.baseUrl}/movies/by-filters`, { params });
  }


  getFilterMovies(
    regionId?: number | null,
    chain?: string | null,
    cinemaId?: number | null
  ): Observable<Movie[]> {

    let params = new HttpParams();

    if (regionId != null) params = params.set('regionId', regionId);
    if (chain && chain.trim().length) params = params.set('chain', chain);
    if (cinemaId != null) params = params.set('cinemaId', cinemaId);

    return this.http.get<Movie[]>(
      `${this.baseUrl}/movies/by-filters`,
      { params }
    );
  }

  public getCarrusel(): Observable<MovieCarrusel[]>{
    return this.http.get<MovieCarrusel[]>(`${this.baseUrl}/carrusel`)
  }

  // public saveAllMovies(movies: Movie[]){
  //   localStorage.setItem("movies", JSON.stringify(movies))
  // }

  public saveAllMoviesT(movies: Movie[]){
    return this.storageService.saveData("movies", JSON.stringify(movies))
  }

  public getMoviesLocal(): Movie[]{
    return this.movies
  }

  getUbicationByGeoCode(lat: number, lng: number): Observable<IUbication>{
    return this.http.get<IUbication>(`${environments.urlGeoCode}reverse?lat=${lat}&lon=${lng}&api_key=${environments.apiKeyGeoCode}`)
  }

}
