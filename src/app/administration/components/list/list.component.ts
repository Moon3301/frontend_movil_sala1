import { Component, Input, OnInit } from '@angular/core';
import { AdministrationService } from '../../services/administration.service';
import { Movie } from '../../interfaces/movies.interface';



@Component({
  selector: 'administration-list',
  standalone: false,

  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit{

  foods: any[] = [
    {value: 'ESTRENO', viewValue: 'ESTRENO'},
    {value: 'PREVENTA', viewValue: 'PREVENTA'},
    {value: 'PROXIMAMENTE', viewValue: 'PROXIMAMENTE'},
  ];

  @Input()
  dataSource : Movie[] = []

  displayedColumns: string[] = ['ID', 'Titulo', 'Tipo'];

  constructor(private readonly admService: AdministrationService){}

  ngOnInit(): void {

    this.admService.getAllMovies()
      .subscribe({

        next:(resp) => {
          this.dataSource = resp;
          console.log(this.dataSource)
        },

        error: (error) => {
          console.log('Ha ocurrido un error al obtener las peliculas.');

        }
      })
  }

  onChangeSelect(event: any, element: Movie){
    console.log('element.id: ', element.id);
    console.log('event.value: ', event.value);

    this.admService.updateManualScreenType(element.id, event.value).subscribe({
      next: (resp) => {
        console.log('Data actualizada');
        this.getAllMovies();
      },
      error: (error) => {
        console.log('Ja ocurrido un error', error);
      }
    })

  }

  getAllMovies(){
    this.admService.getAllMovies()
      .subscribe({

        next:(resp) => {
          this.dataSource = resp;
          console.log(this.dataSource)
        },

        error: (error) => {
          console.log('Ha ocurrido un error al obtener las peliculas.');

        }
      })

  }
}
