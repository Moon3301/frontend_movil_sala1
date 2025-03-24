import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../interfaces/movie.interface';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DataBillboard, ICines } from '../../interfaces/funciones.interface';
import { MatDialog } from '@angular/material/dialog';
import { ExpansionPanelComponent } from '../../components/expansion-panel/expansion-panel.component';
import { CardVideoComponent } from '../../components/card-video/card-video.component';
import { getFormattedDate } from '../../../common/helpers';
import { Geolocation } from '@capacitor/geolocation';
import { StorageService } from '../../../storage/storage.service';

@Component({
  selector: 'movie-movie-page',
  standalone: false,

  templateUrl: './movie-page.component.html',
  styleUrl: './movie-page.component.css'
})
export class MoviePageComponent  implements OnInit{

  movie?: Movie
  funciones?: ICines[]
  fechas?: string[]

  trailerSafeUrl!: SafeResourceUrl;

  constructor(
    private activateRoute: ActivatedRoute,
    private movieService: MovieService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private storageService: StorageService
  ){}

  ngOnInit(): void {
    console.log('Entrando a movie');
    const currentDate = getFormattedDate();

    this.activateRoute.params.pipe(
      switchMap(({ id }) => {
        const movieId = +id;
        return this.movieService.getMovieByIdLocal(movieId)
      }),
      tap(movie => {
        if (!movie) {
          // Si no se encuentra la película, se redirige y se detiene la cadena.
          this.router.navigateByUrl('/');
        }
      }),
      // Continuar solo si se obtuvo la película.
      filter(movie => !!movie),
      tap(movie => {
        this.movie = movie;
        const embedUrl = this.getYouTubeEmbedUrl(movie.trailer_url);
        this.trailerSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      }),
      // Obtener la región (ya sea del localStorage o mediante geolocalización).
      switchMap(() => this.getRegionName()),
      // Una vez se tiene la región, se solicitan los cines.
      switchMap(regionName =>
        this.movieService.getCinemasByUbicationAndMovie(this.movie!.id, regionName, currentDate)
      )
    ).subscribe(
      (dataBillboard) => {
        this.funciones = dataBillboard.data;
        this.fechas = dataBillboard.dates;

        console.log(this.funciones);
      },
      error => console.error(error)
    );
  }

  private getRegionName(): Observable<string> {
    return this.storageService.getData('user_ubication').pipe(
      switchMap(storedRegion => {
        if (storedRegion) {
          // Si ya hay una región guardada en Storage, la devolvemos enseguida
          return of(storedRegion);
        } else {
          // Si no hay región, usamos Geolocation y luego llamamos a la API
          return from(Geolocation.getCurrentPosition()).pipe(
            switchMap(position =>
              this.movieService.getUbicationByGeoCode(
                position.coords.latitude,
                position.coords.longitude
              )
            ),
            map(response => {
              const region = response.address.state;
              // Guardamos la región localmente (puedes usar localStorage
              // o mejor aún, storageService.setData(...) para ser consistente)
              //localStorage.setItem('user_ubication', region);
              this.storageService.saveData('user_ubication', region).subscribe({
                next: () => {
                  console.log('Ubicación guardada en el almacenamiento local');
                },
                error: (error) => {
                  console.error('Error al guardar ubicación:', error);
                }
              })

              return region;
            })
          );
        }
      })
    );
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

  getYouTubeThumbnailUrl(originalUrl: string | undefined): string {
    if (!originalUrl) return '';

    let videoId = '';

    // 1. Si incluye "youtu.be/"
    if (originalUrl.includes('youtu.be/')) {
      const parts = originalUrl.split('youtu.be/');
      videoId = parts[1]?.split('?')[0]; // en caso tenga parámetros
    }
    // 2. Si incluye "watch?v="
    else if (originalUrl.includes('watch?v=')) {
      const params = new URL(originalUrl).searchParams;
      videoId = params.get('v') || '';
    }
    // 3. Si incluye "embed/"
    else if (originalUrl.includes('/embed/')) {
      const parts = originalUrl.split('/embed/');
      videoId = parts[1]?.split('?')[0];
    }

    if (!videoId) return ''; // o algún valor por defecto

    // Retorna la URL del thumbnail, en este caso "hqdefault" es de alta calidad
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  openBillboards(){


    this.dialog.open(ExpansionPanelComponent, {
      data: {
        billboards: this.funciones,
        movie: this.movie,
        dates: this.fechas
      },
      width: '80%',
      height: '80%',
      maxWidth: '100%',
      panelClass: 'custom-dialog-container',    // Clase personalizada para el contenedor
      backdropClass: 'custom-dialog-backdrop'     // (Opcional) Clase para el backdrop
    });
  }

  openVideoDialog(): void {
    this.dialog.open(CardVideoComponent, {
      data: {
        embedUrl: this.getYouTubeEmbedUrl(this.movie?.trailer_url)
      },
      width: '90%',
      maxWidth: '100%',
      height: '90%'
    });
  }


}
