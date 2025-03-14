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
    // this.dates = this.getNextFiveDates();
    this.dates = this.data.dates
    console.log('this.dates: ',this.dates);

    this.dataBillboards = this.data

    if(this.dataBillboards.billboards.length == 0){

      const regionName = localStorage.getItem("user_ubication");
      const movieId = this.data.movie.id;

      this.getShowtimes(movieId, regionName!, this.dates[0])
    }

  }

  buildUrlPaymentCinepolis(vistaId:string, showtimeId: string){
    window.open(`https://compra.cinepolis.com/?cinemaVistaId=${vistaId}&showtimeVistaId=${showtimeId}&countryCode=CL`, '_blank')
  }

  buildUrlPaymentCinemark(tag: string, showtimeId: string, date:string,  hour: string, cineSlug:string, sessionId: string){

    console.log(tag, showtimeId, date, hour, cineSlug);

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

    console.log(data);


    window.open(`https://www.cinemark.cl/compra?tag=${tag}&movie_id=${showtimeId}&showtime=${sessionId}&date=${currentDate}&hour=${hour}&pelicula=${this.data.movie.title_slug}&cine=${transformedString}`, '_blank')
  }

  buildUrlPaymentCineplanet(titleSlug: string, cinemaId: string, sessionId: string){

    // https://www.cineplanet.cl/compra/attack-on-titan-el-ataque-final/0000000001/60657/asientos
    //                                        movieDetailsUrl            cinemaId sessionId

    window.open(`https://www.cineplanet.cl/compra/${titleSlug}/${cinemaId}/${sessionId}/asientos`)

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

      const regionName = localStorage.getItem("user_ubication");
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

  isButtonDisabled(showtime: string, showdate: string): boolean {

    const dShow = new Date(showdate);
    const dNow = new Date();

    const sameDay =
    dShow.getMonth() === dNow.getMonth() &&
    dShow.getDate() === dNow.getDate();

    if (sameDay) {
      // Extraemos [hora, minuto] de showtime (p.ej. "17:40")
      const [hours, minutes] = showtime.split(':').map(val => parseInt(val, 10));

      // 3) Creamos la fecha de la función usando el día actual y la hora dada
      const showtimeDate = new Date();
      showtimeDate.setHours(hours, minutes, 0, 0);

      // 4) Calculamos la diferencia: (AHORA) - (HORA DE LA FUNCIÓN)
      const diffMs = dNow.getTime() - showtimeDate.getTime();

      // 20 minutos en milisegundos
      const twentyMinutesMs = 20 * 60 * 1000;

      // 5) Si la hora actual está al menos 20min por encima del showtime:
      //    => deshabilitar botón
      return diffMs >= twentyMinutesMs;

    } else {
      // Si no es el mismo día, tu lógica:
      // Por ejemplo, deshabilitar si la fecha es anterior,
      // o no deshabilitar si es un día futuro...
      return dShow < dNow;
    }

  }


}
