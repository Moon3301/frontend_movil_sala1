import { Component, Input, OnInit } from '@angular/core';
import { Movie } from '../../interfaces/movie.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'movie-card',
  standalone: false,

  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {

  @Input()
  movie?: Movie

  constructor(private router:Router){

  }
  ngOnInit(): void {
    
  }

  navigateToMovie(movieId: any){
    this.router.navigate(['/movie', movieId])
  }

}
