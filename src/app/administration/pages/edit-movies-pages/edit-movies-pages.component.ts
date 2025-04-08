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

    this.editForm.patchValue({
      title: movie.title,
      screen_type: movie.screen_type,
      title_sinopsis: movie.synopsis_alt,
      synopsis: movie.synopsis,
      img_url: movie.img_url
    });

    this.visible = true;
  }

  foods: any[] = [
    {value: 'ESTRENO', viewValue: 'ESTRENO'},
    {value: 'PREVENTA', viewValue: 'PREVENTA'},
    {value: 'PROXIMAMENTE', viewValue: 'PROXIMAMENTE'},
  ];

  @Input()
  dataSource : Movie[] = []

  constructor(private readonly admService: AdministrationService, private fb: FormBuilder){

  }

  ngOnInit(): void {

    this.editForm = this.fb.group({
      title: ['', Validators.required],
      screen_type: ['', Validators.required],
      title_sinopsis: ['', Validators.required],
      synopsis: ['', Validators.required],
      img_url: ['', Validators.required],
    })

    this.admService.getAllMovies()
      .subscribe({

        next:(resp) => {
          this.dataSource = resp;


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
    const title = this.editForm.get('title')?.value;
    const screen_type = this.editForm.get('screen_type')?.value;
    const title_sinopsis = this.editForm.get('title_sinopsis')?.value;
    const synopsis = this.editForm.get('synopsis')?.value;

    console.log('movieId', movieId);
    console.log('img_url', img_url);
    console.log('title', title);
    console.log('screen_type', screen_type);
    console.log('title_sinopsis', title_sinopsis);
    console.log('synopsis', synopsis);

    this.admService.updateMovie( movieId!, screen_type.value, img_url, title, title_sinopsis, synopsis).subscribe({
      next: (resp) => {

        console.log('Data actualizada correctamente');
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

        this.visible = false;
      },
      error: (error) => {
        console.log('Ocurrio un error al actualizar la data', error);
      }
    })

    // this.admService.updateImgUrl(movieId!, img_url).subscribe({
    //   next: () => {
    //     console.log('Imagen actualizada correctamente');
    //     this.getAllMovies();
    //   },
    //   error: (error) => {
    //     console.log('Ocurrio un error al actualizar la img.', error);
    //   }
    // })

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
