import { Component, OnInit } from '@angular/core';
import { Movie } from '../../interfaces/movie.interface';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'movie-list-movie-page',
  standalone: false,

  templateUrl: './list-movie-page.component.html',
  styleUrl: './list-movie-page.component.css'
})
export class ListMoviePageComponent implements OnInit{

  movies: Movie[] = []

  constructor(private movieService: MovieService){}

  ngOnInit(): void {

    this.movieService.getMovies()
      .subscribe( movies => {
        this.movies = movies

        this.movieService.saveAllMovies(this.movies)

      })

  }



  getMovies(): void{
    console.log(this.movies)
    // this.movies = this.movieService.getMoviesLocal()
  }


}
