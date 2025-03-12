import { Injectable } from '@angular/core';
import { Movie } from '../interfaces/movie.interface';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environments';
import { DataBillboard, ICines } from '../interfaces/funciones.interface';
import { getFormattedDate } from '../../common/helpers';
import { MovieCarrusel } from '../../administration/interfaces/movies.interface';
import { IUbication } from '../../common/interfaces';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private baseUrl: string = environments.baseUrl;

  movies: Movie[] = []

  constructor(private http: HttpClient) {}

  public getBillboards( movieId: number): Observable<ICines[]>{
    return this.http.post<ICines[]>(`${this.baseUrl}/billboard`, { movieId: movieId } )
  }

  public getCinemasByUbicationAndMovie( movieId: number, regionName: string, currentDate?: string): Observable<DataBillboard>{
    return this.http.get<DataBillboard>(
      `${this.baseUrl}/billboard/${currentDate}?movieId=${movieId}&regionName=${regionName}`
    )
  }

  public getMovieByIdLocal( movieId: number): Observable<Movie>{

    const moviesStorage = localStorage.getItem("movies");

    const movies: Movie[] = moviesStorage ? JSON.parse(moviesStorage) : [];

    const movie = movies.find(movie => movie.id === movieId)

    return of(movie!)
  }

  public getMovies(): Observable<Movie[]>{
    return this.http.get<Movie[]>(`${this.baseUrl}/movies`)
  }

  public getCarrusel(): Observable<MovieCarrusel[]>{
    return this.http.get<MovieCarrusel[]>(`${this.baseUrl}/carrusel`)
  }

  public saveAllMovies(movies: Movie[]){
    localStorage.setItem("movies", JSON.stringify(movies))
  }

  public getMoviesLocal(): Movie[]{
    return this.movies
  }

  getUbicationByGeoCode(lat: number, lng: number): Observable<IUbication>{
    return this.http.get<IUbication>(`${environments.urlGeoCode}reverse?lat=${lat}&lon=${lng}&api_key=${environments.apiKeyGeoCode}`)
  }

}
