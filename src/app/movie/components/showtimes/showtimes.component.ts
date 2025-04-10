import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, ChangeDetectorRef  } from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import { ICinema, ICines } from '../../interfaces/funciones.interface';
import { Movie } from '../../interfaces/movie.interface';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MovieService } from '../../services/movie.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatOptionSelectionChange } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ProgressBarModule } from 'primeng/progressbar';
// For dynamic progressbar demo
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'movie-showtimes',
  standalone: true,
  templateUrl: './showtimes.component.html',
  styleUrl: './showtimes.component.css',
  imports: [
    MatDialogModule,
    MatDividerModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    CommonModule,
    MatIconModule,
    ProgressBarModule,
    ToastModule,

  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowtimesComponent implements OnInit {

  isRedirect!: boolean;
  timeRedirect: number = 2000;

  dates: string[] = [];
  dataShowtimes!: { showtimes: ICinema[]; movie: Movie; dates: string[], cinema: string };
  movie!: Movie;
  cinemaType!: string;

  isLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ShowtimesComponent>,
    private movieService: MovieService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public data: { showtimes: ICinema[], movie: Movie, dates: string[], cinema: string },
  ){}

  ngOnInit(): void {

    this.dates = this.data.dates
    this.cinemaType = this.data.cinema;
    this.dataShowtimes = this.data

    this.dataShowtimes.showtimes.forEach(cinema => {
      cinema.showtimes.sort((a, b) => {
        return this.timeToMinutes(a.showtime) - this.timeToMinutes(b.showtime);
      });
    });

  }

  buildUrlPaymentCinepolis(vistaId:string, showtimeId: string){
    const cinema = 'Cinepolis'
    // necesito agregar un tiempo de espera antes de direccionar al usuario a la pagina de compra.
    this.showMessage(cinema);
    setTimeout(() => {
      Browser.open({ url: `https://compra.cinepolis.com/?cinemaVistaId=${vistaId}&showtimeVistaId=${showtimeId}&countryCode=CL`})
      //window.open(`https://compra.cinepolis.com/?cinemaVistaId=${vistaId}&showtimeVistaId=${showtimeId}&countryCode=CL`, '_blank')
    }, this.timeRedirect)

  }

  buildUrlPaymentCinemark(tag: string, showtimeId: string, date:string,  hour: string, cineSlug:string, sessionId: string){

    const cinema = 'Cinemark'

    const currentDate =  date.split('T')[0];
    const transformedString = cineSlug.replace(/-/g, "_");

    const data = {
      tag,
      movie_id: this.data.movie.external_id,
      showtimeId,
      currentDate,
      hour,
      movie_title_slug: this.data.movie.title_slug,
      transformedString
    }

    this.showMessage(cinema);
    setTimeout(() => {
      Browser.open({ url: `https://www.cinemark.cl/compra?tag=${tag}&movie_id=${showtimeId}&showtime=${sessionId}&date=${currentDate}&hour=${hour}&pelicula=${this.data.movie.title_slug}&cine=${transformedString}`})
      //window.open(`https://www.cinemark.cl/compra?tag=${tag}&movie_id=${showtimeId}&showtime=${sessionId}&date=${currentDate}&hour=${hour}&pelicula=${this.data.movie.title_slug}&cine=${transformedString}`, '_blank')
    }, this.timeRedirect)

  }

  buildUrlPaymentCineplanet(titleSlug: string, cinemaId: string, sessionId: string){

    const cinema = 'Cineplanet'

    this.showMessage(cinema);
    setTimeout(() => {
      Browser.open({ url: `https://www.cineplanet.cl/compra/${titleSlug}/${cinemaId}/${sessionId}/asientos`})
      //window.open(`https://www.cineplanet.cl/compra/${titleSlug}/${cinemaId}/${sessionId}/asientos`)
    }, this.timeRedirect)

  }

  buildUrlPaymentMuvix(cinemaId: string, sessionId: string){

    const cinema = 'Muvix'
    this.showMessage(cinema);
    setTimeout(() => {
      Browser.open({ url: `https://muvix.cl/Ticketing/visSelectTickets.aspx?cinemacode=${cinemaId}&txtSessionId=${sessionId}&visLang=1`})
      //window.open(`https://muvix.cl/Ticketing/visSelectTickets.aspx?cinemacode=${cinemaId}&txtSessionId=${sessionId}&visLang=1`)
    }, this.timeRedirect)

  }

  buildUrlPaymentCinestar(cinemaId: string, sessionId: string){

    const cinema = 'Cinestar'
    this.showMessage(cinema);
    setTimeout(() => {
      Browser.open({ url: `https://cinestar.cl/Ticketing/visSelectTickets.aspx?cinemacode=${cinemaId}&txtSessionId=${sessionId}&visLang=1`})
      //window.open(`https://cinestar.cl/Ticketing/visSelectTickets.aspx?cinemacode=${cinemaId}&txtSessionId=${sessionId}&visLang=1`)
    }, this.timeRedirect)

  }

  onClose(): void{
    this.dialogRef.close(true);
  }

  isButtonDisabled(showtime: string, showdate: string, cinemaType: string): boolean {
    /* ───── Normalizar fechas ───── */
    // 1) Fecha del show sin hora (forzamos hora 00:00 local)
    const dShow = new Date(`${showdate}T00:00:00`);
    // 2) Hoy sin hora
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    /* ───── Filtro por día ───── */
    if (dShow.getTime() > today.getTime()) {
      // Mañana o después ⇒ botón habilitado
      return false;
    }
    if (dShow.getTime() < today.getTime()) {
      // Ayer o antes ⇒ botón deshabilitado
      return true;
    }

    /* ───── Aquí sabemos que es HOY ───── */
    // Hora del show
    const [hours, minutes] = showtime.split(':').map(Number);
    const showtimeDate = new Date(today);          // mismo día
    showtimeDate.setHours(hours, minutes, 0, 0);   // hora del show

    // Umbral: 20 min o 0 min para Cinemark
    const threshold =
      cinemaType.toLowerCase() === 'cinemark' ? 0 : 20 * 60 * 1000;

    // Si ya pasaron ≥ threshold ms desde la hora del show ⇒ deshabilitar
    return now.getTime() - showtimeDate.getTime() >= threshold;
  }

  showMessage(cinema:string){
    this.messageService.add(
      {
        severity: 'contrast',
        summary: `Redireccionando a ${cinema}`,
        detail: 'Redireccionando a la pagina de compra ...',
        life: this.timeRedirect + 100 }
    );
  }

  // Método de ayuda que convierte "HH:MM" en minutos
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

}
