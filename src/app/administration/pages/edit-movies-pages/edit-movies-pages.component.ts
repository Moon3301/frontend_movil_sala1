import { Component, Input, OnInit } from '@angular/core';
import { AdministrationService } from '../../services/administration.service';
import { Movie } from '../../interfaces/movies.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'adm-edit-movies-pages',
  standalone: false,
  templateUrl: './edit-movies-pages.component.html',
  styleUrl: './edit-movies-pages.component.css'
})
export class EditMoviesPagesComponent implements OnInit{

  visible: boolean = false;

  Editmovie?: Movie

  public editForm!: FormGroup;

  showDialog(movie: Movie) {

    this.Editmovie = movie
    this.visible = true;
  }

  foods: any[] = [
    {value: 'ESTRENO', viewValue: 'ESTRENO'},
    {value: 'PREVENTA', viewValue: 'PREVENTA'},
    {value: 'PROXIMAMENTE', viewValue: 'PROXIMAMENTE'},
  ];

  @Input()
  dataSource : Movie[] = []

  displayedColumns: string[] = ['ID', 'Titulo', 'Imagen', 'Rating', 'Tipo'];

  constructor(private readonly admService: AdministrationService, private fb: FormBuilder){
    this.editForm = this.fb.group({
      img_url: ['', Validators.required],
    })
  }

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

  onChangesInput(){

    const movieId = this.Editmovie?.id;
    const img_url = this.editForm.get('img_url')?.value;

    this.admService.updateImgUrl(movieId!, img_url).subscribe({
      next: () => {
        console.log('Imagen actualizada correctamente');
        this.getAllMovies();
      },
      error: (error) => {
        console.log('Ocurrio un error al actualizar la img.', error);
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
