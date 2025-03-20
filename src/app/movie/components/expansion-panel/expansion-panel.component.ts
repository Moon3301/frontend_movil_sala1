import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, ChangeDetectorRef  } from '@angular/core';

import {MatDialogModule} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import { ICines } from '../../interfaces/funciones.interface';
import { Movie } from '../../interfaces/movie.interface';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MovieService } from '../../services/movie.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatOptionSelectionChange } from '@angular/material/core';

@Component({
  selector: 'movie-expansion-panel',
  standalone: true,
  imports:[
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './expansion-panel.component.html',
  styleUrl: './expansion-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpansionPanelComponent implements OnInit{

  dates: string[] = []
  dataBillboards!: { billboards: ICines[]; movie: Movie; };
  isLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ExpansionPanelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { billboards: ICines[], movie: Movie, dates: string[] },
    private movieService: MovieService,
    private cdr: ChangeDetectorRef // <-- Agrega esto

  ){}

  ngOnInit(): void {

    this.dates = this.data.dates

    this.dataBillboards = this.data

    if(this.dataBillboards.billboards.length == 0){

      const regionName = sessionStorage.getItem("user_ubication");
      const movieId = this.data.movie.id;

      this.getShowtimes(movieId, regionName!, this.dates[0])
    }

  }

  buildUrlPaymentCinepolis(vistaId:string, showtimeId: string){
    window.open(`https://compra.cinepolis.com/?cinemaVistaId=${vistaId}&showtimeVistaId=${showtimeId}&countryCode=CL`, '_blank')
  }

  buildUrlPaymentCinemark(tag: string, showtimeId: string, date:string,  hour: string, cineSlug:string, sessionId: string){

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

    window.open(`https://www.cinemark.cl/compra?tag=${tag}&movie_id=${showtimeId}&showtime=${sessionId}&date=${currentDate}&hour=${hour}&pelicula=${this.data.movie.title_slug}&cine=${transformedString}`, '_blank')
  }

  buildUrlPaymentCineplanet(titleSlug: string, cinemaId: string, sessionId: string){
    window.open(`https://www.cineplanet.cl/compra/${titleSlug}/${cinemaId}/${sessionId}/asientos`)
  }

  buildUrlPaymentMuvix(cinemaId: string, sessionId: string){
    window.open(`https://muvix.cl/Ticketing/visSelectTickets.aspx?cinemacode=${cinemaId}&txtSessionId=${sessionId}&visLang=1`)
  }

  onClose(): void{
    this.dialogRef.close(true);
  }

  getNextFiveDates(): string[] {
    const dates: string[] = [];
    const today = new Date();

    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }

    return dates;

  }

  onSelectDate(fecha: string, event?: MatOptionSelectionChange) {
    if(event?.isUserInput){

      const regionName = sessionStorage.getItem("user_ubication");
      const movieId = this.data.movie.id;

      this.getShowtimes(movieId, regionName!, fecha)

    }
  }

  getShowtimes(movieId: number, regionName: string, fecha: string){

    this.isLoading = true;
    this.cdr.detectChanges();

    this.movieService.getCinemasByUbicationAndMovie(movieId, regionName!, fecha).subscribe({
      next: (response) => {

        this.data.billboards = response.data;

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

  isButtonDisabled(showtime: string, showdate: string, cinemaType: string): boolean {
    const dShow = new Date(showdate);
    const dNow = new Date();

    const sameDay =
      dShow.getMonth() === dNow.getMonth() &&
      dShow.getDate() === dNow.getDate();

    if (sameDay) {
      // Extraemos [hora, minuto] de showtime (por ejemplo, "17:40")
      const [hours, minutes] = showtime.split(':').map(val => parseInt(val, 10));

      // Creamos la fecha con el día de hoy y la hora indicada
      const showtimeDate = new Date();
      showtimeDate.setHours(hours, minutes, 0, 0);

      // Calculamos la diferencia en milisegundos entre ahora y la hora del show
      const diffMs = dNow.getTime() - showtimeDate.getTime();

      // Definimos el umbral. Por defecto son 20 minutos en milisegundos
      let threshold = 20 * 60 * 1000;

      // Si el cine es cinemark, queremos deshabilitar justo cuando termine el showtime
      if (cinemaType.toLowerCase() === 'cinemark') {
        threshold = 0;
      }

      // Si han pasado al menos 'threshold' milisegundos desde el showtime, deshabilitamos el botón
      return diffMs >= threshold;
    } else {
      // Si no es el mismo día, se deshabilita el botón si la fecha del show es anterior al día actual.
      return dShow < dNow;
    }
  }


}
