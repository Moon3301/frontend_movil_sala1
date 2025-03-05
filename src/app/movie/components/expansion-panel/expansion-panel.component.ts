import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from '@angular/core';

import {MatDialogModule} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import { ICines } from '../../interfaces/funciones.interface';
import { Movie } from '../../interfaces/movie.interface';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'movie-expansion-panel',
  standalone: true,
  imports:[
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule
  ],
  templateUrl: './expansion-panel.component.html',
  styleUrl: './expansion-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpansionPanelComponent implements OnInit{

  constructor(public dialogRef: MatDialogRef<ExpansionPanelComponent>, @Inject(MAT_DIALOG_DATA) public data: { billboards: ICines[], movie: Movie }){}

  ngOnInit(): void {}


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

}
