import { Component, ElementRef, model, OnInit, ViewChild } from '@angular/core';
import { MovieCarrusel } from '../../../administration/interfaces/movies.interface';
import { MovieService } from '../../services/movie.service';
import { environments } from '../../../../environments/environments';

@Component({
  selector: 'movie-carrusel',
  standalone: false,

  templateUrl: './carrusel.component.html',
  styleUrl: './carrusel.component.css'
})
export class CarruselComponent implements OnInit{

  @ViewChild('carouselContainer') carouselContainer!: ElementRef;

  baseUrl = environments.baseUrl;

  poster_url: string = '';

  moviePoster!: MovieCarrusel;

  moviesCarrusel: MovieCarrusel[] = [];

  constructor(private movieService: MovieService){}

  ngOnInit(): void {
    this.loadCarouselData();
  }

  loadCarouselData(): void {
    this.movieService.getCarrusel().subscribe({

      next: (movies) => {

        this.moviesCarrusel = movies.sort((a, b) => a.position - b.position);

        // this.moviesCarrusel.map( movie => {
        //   movie.poster_url = this.baseUrl + '/uploads/' + movie.poster_url;
        // })

        this.moviePoster = this.moviesCarrusel[0];
        //this.moviePoster.poster_url = this.baseUrl + '/uploads/' + this.moviesCarrusel[0].poster_url;

      },
      error: (err) => console.error('Error cargando carrusel:', err)
    });
  }

  selectMovie(movie: any){
    this.moviePoster = movie;
  }

  scrollCarousel(direction: string): void {
    const container = this.carouselContainer.nativeElement;
    const scrollAmount = 200; // Ajusta este valor según convenga
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

}
