import { Component } from '@angular/core';

@Component({
  selector: 'movie-carrusel',
  standalone: false,

  templateUrl: './carrusel.component.html',
  styleUrl: './carrusel.component.css'
})
export class CarruselComponent {

  dataCarrusel = [
    {
      title: 'Primero',
      subtitle: 'primer registro',
      src: 'img/img1.jpg',
      description: ' test primer registro'
    },
    {
      title: 'Segundo',
      subtitle: 'segundo registro',
      src: 'img/img2.jpg',
      description: 'test segundo registro'
    },
    {
      title: 'Tercero',
      subtitle: 'tercer registro',
      src: 'img/img3.jpg',
      description: 'test tercer registro'
    },

  ]

  constructor(){}

}
