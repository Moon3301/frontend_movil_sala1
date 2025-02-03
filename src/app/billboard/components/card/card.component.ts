import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'billboard-card',
  standalone: false,

  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit{

  // TODO: Agregar interfaces para movie
  @Input()
  movie!:any

  constructor(){}

  ngOnInit(): void {
    if (!this.movie) throw Error('Hero property is required');
  }

}
