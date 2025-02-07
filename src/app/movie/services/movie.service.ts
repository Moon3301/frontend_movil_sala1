import { Injectable } from '@angular/core';
import { Movie } from '../interfaces/movie.interface';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environments';
import { ICines } from '../interfaces/funciones.interface';
import { getFormattedDate } from '../../common/helpers';

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

  public getCinemasByUbicationAndMovie( movieId: number, latitude: number, longitude: number): Observable<ICines[]>{

    const currentDate = getFormattedDate();

    return this.http.get<ICines[]>(
      `${this.baseUrl}/billboard/${currentDate}?movieId=${movieId}&latitude=${latitude}&longitude=${longitude}`
    )
  }

  public getMovieByIdLocal( movieId: number): Observable<Movie>{

    const moviesStorage = localStorage.getItem("movies");
    const movies: Movie[] = moviesStorage ? JSON.parse(moviesStorage) : [];

    const movie = movies.find(movie => movie.id === movieId)

    console.log(movie);

    return of(movie!)
  }

  public getMovies(): Observable<Movie[]>{
    return this.http.get<Movie[]>(`${this.baseUrl}/movies`)
  }

  public saveAllMovies(movies: Movie[]){
    console.log('Data guardada en local Storage');

    localStorage.setItem("movies", JSON.stringify(movies))
  }

  public getMoviesLocal(): Movie[]{
    return this.movies
  }
}
