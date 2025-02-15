import { Component, OnInit } from '@angular/core';
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

  constructor(private movieService: MovieService){}

  ngOnInit(): void {
    this.loadCarouselData();
  }

  loadCarouselData(): void {
    this.movieService.getCarrusel().subscribe({

      next: (movies) => {

        this.moviesCarrusel = movies.sort((a, b) => a.position - b.position);
        console.log('moviesCarrusel: ',this.moviesCarrusel);
      },
      error: (err) => console.error('Error cargando carrusel:', err)
    });
  }

}
