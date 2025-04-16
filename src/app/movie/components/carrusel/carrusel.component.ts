import { AfterViewInit, Component, ElementRef, model, OnInit, ViewChild } from '@angular/core';
import { MovieCarrusel } from '../../../administration/interfaces/movies.interface';
import { MovieService } from '../../services/movie.service';
import { environments } from '../../../../environments/environments';

@Component({
  selector: 'movie-carrusel',
  standalone: false,

  templateUrl: './carrusel.component.html',
  styleUrl: './carrusel.component.css',

})
export class CarruselComponent implements OnInit{

  baseUrl = environments.baseUrl;

  poster_url: string = '';

  moviePoster!: MovieCarrusel;

  moviesCarrusel: MovieCarrusel[] = [];

  originalWidth = 0;

  constructor(private movieService: MovieService){}


  ngOnInit(): void {
    this.loadCarouselData();
  }

  loadCarouselData(): void {
    this.movieService.getCarrusel().subscribe({

      next: (movies) => {

        this.moviesCarrusel = movies.sort((a, b) => a.position - b.position);

        this.moviePoster = this.moviesCarrusel[0];

      },
      error: (err) => console.error('Error cargando carrusel:', err)
    });
  }

  selectMovie(movie: any){
    this.moviePoster = movie;
  }

}
