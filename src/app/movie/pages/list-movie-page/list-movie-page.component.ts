import { Component, OnInit } from '@angular/core';
import { Movie } from '../../interfaces/movie.interface';
import { MovieService } from '../../services/movie.service';
import { MovieCarrusel } from '../../../administration/interfaces/movies.interface';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'movie-list-movie-page',
  standalone: false,

  templateUrl: './list-movie-page.component.html',
  styleUrl: './list-movie-page.component.css'
})
export class ListMoviePageComponent implements OnInit{

  movies: Movie[] = []
  moviesSkeleton = Array.from({ length : 6})

  moviesPremiere: Movie[] = []
  moviesPresale: Movie[] = []
  moviesComingSoon: Movie[] = []

  // Índice del tab seleccionado
  selectedTabIndex = 0;

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router
  ){}

  ngOnInit(): void {

    forkJoin([
      this.movieService.getMovies(),
      this.movieService.getCarrusel()
    ]).subscribe({
      next: ([allMovies, moviesCarrusel]) => {

        const finalList = this.combineAndSort(allMovies, moviesCarrusel);
        this.movies = finalList;

        this.movieService.saveAllMoviesT(this.movies).subscribe({
          next: (resp)=> {
            // console.log('Peliculas guardadas en localStorage');
          },
          error: (error)=> {
            console.log('Error al guardar las peliculas', error);
          }
        })

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

    // Leer el índice de la URL (query params, por ejemplo)
    this.route.queryParams.subscribe(params => {
      const tabIndex = +params['tab'] || 0; // si no hay 'tab', usar 0
      this.selectedTabIndex = tabIndex;
    });

  }

  onTabChange(event: any) {
    const index = event.index;
    // Navegar a la misma ruta, pero cambiando el query param 'tab'
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: index },
      queryParamsHandling: 'merge' // mantiene los demás query params que existan
    });
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
