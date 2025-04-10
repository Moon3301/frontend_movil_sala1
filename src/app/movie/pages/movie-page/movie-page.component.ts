import { Component, OnInit, ChangeDetectorRef, HostListener, ViewChild, ElementRef, AfterViewInit  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, filter, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../interfaces/movie.interface';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ICinema, ICines } from '../../interfaces/funciones.interface';
import { MatDialog } from '@angular/material/dialog';
import { ExpansionPanelComponent } from '../../components/expansion-panel/expansion-panel.component';
import { CardVideoComponent } from '../../components/card-video/card-video.component';
import { getFormattedDate } from '../../../common/helpers';
import { Geolocation } from '@capacitor/geolocation';
import { StorageService } from '../../../storage/storage.service';
import { ShowtimesComponent } from '../../components/showtimes/showtimes.component';
import { MatOptionSelectionChange } from '@angular/material/core';
import { App } from '@capacitor/app';
import { Location } from '@angular/common';  // Para retroceder en Angular
import { ViewportScroller } from '@angular/common';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'movie-movie-page',
  standalone: false,

  templateUrl: './movie-page.component.html',
  styleUrl: './movie-page.component.css'
})
export class MoviePageComponent  implements OnInit, AfterViewInit  {

  @ViewChild('topFocus') topFocus!: ElementRef;

  @ViewChild('videoContainer') videoContainerRef!: ElementRef;
  @ViewChild('detailContainer') detailContainerRef!: ElementRef;

  movie?: Movie
  funciones?: ICines[]
  dates: string[] = []
  isLoading: boolean = false;
  selectedDate: any

  trailerSafeUrl!: SafeResourceUrl;

  constructor(
    private activateRoute: ActivatedRoute,
    private movieService: MovieService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private viewportScroller: ViewportScroller,

  ){}
  ngAfterViewInit() {

    this.topFocus.nativeElement.focus();

    if (Capacitor.getPlatform() === 'ios') {
      this.detailContainerRef.nativeElement.classList.add('ios-device');
    }

  }

  ngOnInit(): void {

    window.scrollTo(0, 0);

    App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        // Retrocede con la API de Angular
        this.location.back();
      } else {
        // Si no hay historial (o no quieres retroceder más), salir de la app
        App.exitApp();
      }
    });

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
        this.dates = dataBillboard.dates;

        const today = this.getTodayString();
        this.selectedDate = this.dates.includes(today) ? today : this.dates[0]

      },
      error => console.error(error)
    );
  }

  private getRegionName(): Observable<string> {
    return this.storageService.getData('user_ubication').pipe(
      switchMap(storedRegion => storedRegion
        ? of(storedRegion)                             // ya estaba guardada
        : from(Geolocation.getCurrentPosition()).pipe( // hay que calcularla
            switchMap(pos =>
              this.movieService.getUbicationByGeoCode(
                pos.coords.latitude,
                pos.coords.longitude
              )
            ),
            map(resp => resp.address.state),
            tap(region =>
              this.storageService.saveData('user_ubication', region).subscribe()
            )
          )
      )
    );
  }

  onSelectDate(fecha: string, event?: MatOptionSelectionChange): void {
    if (!event?.isUserInput) { return; }          // ignorar cambios programáticos

    this.getRegionName()                          // ← ya devuelve la región (de storage o geo)
      .pipe(
        switchMap(region =>
          this.movieService
              .getCinemasByUbicationAndMovie(this.movie!.id, region, fecha)
              .pipe(
                tap(() => this.isLoading = true)  // spinner ON
              )
        ),
        tap(response => {
          this.funciones = response.data;
          this.dates     = response.dates;
          this.isLoading = false;                 // spinner OFF
          this.cdr.detectChanges();
        }),
        catchError(err => {
          console.error(err);
          this.isLoading = false;
          this.cdr.detectChanges();
          return EMPTY;
        })
      )
      .subscribe();
  }

  getShowtimes(movieId: number, regionName: string, fecha: string){

    this.isLoading = true;
    this.cdr.detectChanges();

    this.movieService.getCinemasByUbicationAndMovie(movieId, regionName!, fecha).subscribe({
      next: (response) => {

        this.funciones = response.data;

        this.dates = response.dates

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {

        console.log(error);

        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });

  }



  openShowtimes(showtimes: ICinema[], cinemaType: string){

    this.dialog.open(ShowtimesComponent, {
      data: {
        cinema: cinemaType,
        showtimes: showtimes,
        movie: this.movie,
        dates: this.dates
      },
      width: '100%',
      height: '80%',
      maxWidth: '100%',
    })

  }

  openBillboards(){

    this.dialog.open(ExpansionPanelComponent, {
      data: {
        billboards: this.funciones,
        movie: this.movie,
        dates: this.dates
      },
      width: '100%',
      height: '80%',
      maxWidth: '100%',
    });
  }

  openVideoDialog(): void {
    this.dialog.open(CardVideoComponent, {
      data: {
        embedUrl: this.getYouTubeEmbedUrl(this.movie?.trailer_url)
      },
      width: '100%',
      maxWidth: '100%',
      height: '90%'
    });
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

  private getTodayString(): string {
    const d = new Date();
    const mm = (d.getMonth() + 1).toString().padStart(2, '0');
    const dd = d.getDate().toString().padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  }

}
