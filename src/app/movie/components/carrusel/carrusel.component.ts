import { Component, model, OnInit } from '@angular/core';
import { MovieCarrusel } from '../../../administration/interfaces/movies.interface';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'movie-carrusel',
  standalone: false,

  templateUrl: './carrusel.component.html',
  styleUrl: './carrusel.component.css'
})
export class CarruselComponent implements OnInit{

  moviesCarrusel: MovieCarrusel[] = [];

  images: String[] = []

  constructor(private movieService: MovieService){}

  responsiveOptions: any[] = [
    {
        breakpoint: '1300px',
        numVisible: 4
    },
    {
        breakpoint: '575px',
        numVisible: 1
    }
  ];

  ngOnInit(): void {
    this.loadCarouselData();


  }

  loadCarouselData(): void {
    this.movieService.getCarrusel().subscribe({

      next: (movies) => {

        this.moviesCarrusel = movies.sort((a, b) => a.position - b.position);
        console.log('moviesCarrusel: ',this.moviesCarrusel);

        const posterUrls = this.moviesCarrusel.map(movie => movie.poster_url);

        this.images = posterUrls

        this.images.push('https://image.tmdb.org/t/p/w1280/gERwLGTa6JGN4qXjkip13eDaxy1.jpg')

      },
      error: (err) => console.error('Error cargando carrusel:', err)
    });
  }

}
