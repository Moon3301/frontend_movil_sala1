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

  swiperBreakpoints = {
    0:    { slidesPerView: 1.5 },
    300:  { slidesPerView: 1.5 },
    350:  { slidesPerView: 1.7 },
    370:  { slidesPerView: 2 },
    500:  { slidesPerView: 2.5 },
    600:  { slidesPerView: 3 },
    700:  { slidesPerView: 3.5 },
    800:  { slidesPerView: 4 },
    960:  { slidesPerView: 5 },
    1280: { slidesPerView: 7 }
  };

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
