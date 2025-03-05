import { Component, OnInit } from '@angular/core';
import { Movie } from '../../interfaces/movie.interface';
import { MovieService } from '../../services/movie.service';
import { MovieCarrusel } from '../../../administration/interfaces/movies.interface';
import { forkJoin, tap } from 'rxjs';

@Component({
  selector: 'movie-list-movie-page',
  standalone: false,

  templateUrl: './list-movie-page.component.html',
  styleUrl: './list-movie-page.component.css'
})
export class ListMoviePageComponent implements OnInit{

  movies: Movie[] = []

  moviesPremiere: Movie[] = []
  moviesPresale: Movie[] = []
  moviesComingSoon: Movie[] = []

  constructor(private movieService: MovieService){}

  ngOnInit(): void {

    forkJoin([
      this.movieService.getMovies(),
      this.movieService.getCarrusel()
    ]).subscribe({
      next: ([allMovies, moviesCarrusel]) => {

        const finalList = this.combineAndSort(allMovies, moviesCarrusel);
        this.movies = finalList;
        this.movieService.saveAllMovies(this.movies);

        this.movies.forEach( movie => {

          if(movie.screen_type === 'ESTRENO'){
            this.moviesPremiere.push(movie)
          }

          if(movie.screen_type === 'PREVENTA'){
            this.moviesPresale.push(movie)
          }

          if(movie.screen_type === 'PROXIMAMENTE'){
            this.moviesComingSoon.push(movie)
          }

        })

      },
      error: (err) => console.error('Error combinando:', err)
    })

    // Asignar movies por tipo



  }

  private combineAndSort(allMovies: Movie[], moviesCarrusel: MovieCarrusel[]): Movie[] {
    // 1. Crear un Map<externalMovieId, position> a partir del carrusel

    const positionMap = new Map<string, number>(
      moviesCarrusel.map(c => [String(c.externalMovieId), c.position])
    );

    // 2. Copiar el array de películas para no mutarlo (opcional)
    const finalList = [...allMovies];

    // 3. Ordenar: las que tengan position, primero (asc), y las que no, al final
    finalList.sort((a, b) => {
      const posA = positionMap.get(a.external_id) ?? Infinity;
      const posB = positionMap.get(b.external_id) ?? Infinity;
      return posA - posB;
    });

    // Devuelvo el array final ya ordenado
    return finalList;
  }

}
