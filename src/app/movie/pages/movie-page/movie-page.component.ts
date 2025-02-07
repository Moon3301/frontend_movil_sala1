import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../interfaces/movie.interface';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ICines } from '../../interfaces/funciones.interface';

@Component({
  selector: 'movie-movie-page',
  standalone: false,

  templateUrl: './movie-page.component.html',
  styleUrl: './movie-page.component.css'
})
export class MoviePageComponent  implements OnInit{

  movie?: Movie
  trailerSafeUrl!: SafeResourceUrl;
  funciones?: ICines[]

  constructor(
    private activateRoute: ActivatedRoute,
    private movieService: MovieService,
    private router: Router,
    private sanitizer: DomSanitizer
  ){}


  ngOnInit(): void {

    console.log('Entrando a movie');

    this.activateRoute.params
      .pipe(
        switchMap( ({ id }) =>{

          const movieId = +id
          return this.movieService.getMovieByIdLocal( movieId )
        }),
      ).subscribe( movie => {

        if( !movie ) return this.router.navigateByUrl('/')

        this.movie = movie

        return;
      })

    const embedUrl = this.getYouTubeEmbedUrl(this.movie?.trailer_url)

    this.trailerSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl!);

    if(this.movie){
      // this.movieService.getBillboards(this.movie.id)
      //   .subscribe(funciones => {
      //     this.funciones = funciones
      //     console.log(this.funciones);
      //   })

      navigator.geolocation.getCurrentPosition(
        (position)=> {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          console.log(`Latitude: ${lat}, Longitude: ${lng}`);

          this.movieService.getCinemasByUbicationAndMovie(this.movie?.id!, lat, lng).subscribe(
            (cinemas) => {
              this.funciones = cinemas
              console.log(this.funciones);

            }
          )

        }
      )


    }


  }

  // Extrae el ID de un URL de YouTube y genera un embed URL
  getYouTubeEmbedUrl(originalUrl: string | undefined): string {
  if (!originalUrl) return '';

  let videoId = '';

  // 1. Si incluye "youtu.be/" => corta a partir de esa ruta
  if (originalUrl.includes('youtu.be/')) {
    // https://youtu.be/VIDEO_ID
    const parts = originalUrl.split('youtu.be/');
    videoId = parts[1]?.split('?')[0]; // en caso haya parámetros
  }
  // 2. Si incluye "watch?v=" => parsea el valor del v=...
  else if (originalUrl.includes('watch?v=')) {
    const params = new URL(originalUrl).searchParams;
    videoId = params.get('v') || '';
  }
  // 3. Si ya incluye "embed/" (caso raro) => extrae todo lo que esté después de /embed/
  else if (originalUrl.includes('/embed/')) {
    const parts = originalUrl.split('/embed/');
    videoId = parts[1]?.split('?')[0];
  }

  // 4. Si por alguna razón videoId sigue vacío, puedes dejarlo tal cual
  // o manejar un fallback. Pero asumiendo que sí sacaste el ID correctamente:
  if (!videoId) {
    return ''; // O un fallback
  }

  // 5. Retorna el link de embed final
  return `https://www.youtube.com/embed/${videoId}`;
}


}
