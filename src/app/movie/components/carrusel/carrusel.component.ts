import { AfterViewInit, Component, ElementRef, model, OnInit, ViewChild } from '@angular/core';
import { MovieCarrusel } from '../../../administration/interfaces/movies.interface';
import { MovieService } from '../../services/movie.service';
import { environments } from '../../../../environments/environments';
import { SwiperContainer } from 'swiper/element';

@Component({
  selector: 'movie-carrusel',
  standalone: false,

  templateUrl: './carrusel.component.html',
  styleUrl: './carrusel.component.css',

})
export class CarruselComponent implements OnInit, AfterViewInit{

  @ViewChild('carouselContainer') carouselContainer!: ElementRef;

  baseUrl = environments.baseUrl;

  poster_url: string = '';

  moviePoster!: MovieCarrusel;

  moviesCarrusel: MovieCarrusel[] = [];

  originalWidth = 0;

  constructor(private movieService: MovieService){}

  ngAfterViewInit(): void {
    const container = this.carouselContainer.nativeElement as HTMLElement;

    // 1) guardamos el ancho del listado original
    this.originalWidth = container.scrollWidth;

    // 2) clonamos todos los pósteres y los añadimos al final
    container.innerHTML += container.innerHTML;
  }

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

  scrollCarousel(dir: 'left' | 'right') {
    const c = this.carouselContainer.nativeElement as HTMLElement;
    const step = 200;

    if (dir === 'left') {
      c.scrollBy({ left: -step, behavior: 'smooth' });

      // si retrocedimos más allá del inicio del original, saltamos al clon
      if (c.scrollLeft <= 0) {
        c.scrollLeft += this.originalWidth;      // sin animación
      }
    } else {
      c.scrollBy({ left: step, behavior: 'smooth' });

      // si avanzamos más allá de la mitad, saltamos al inicio del original
      if (c.scrollLeft >= this.originalWidth) {
        c.scrollLeft -= this.originalWidth;      // sin animación
      }
    }
  }

}
