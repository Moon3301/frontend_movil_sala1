import { ChangeDetectorRef, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { MessageService } from 'primeng/api';
import { environments } from '../../../../environments/environments';
import { ListsCarrusel, Movie, MovieCarrusel } from '../../interfaces/movies.interface';
import { AdministrationService } from '../../services/administration.service';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'adm-edit-carrusel-page',
  standalone: false,

  templateUrl: './edit-carrusel-page.component.html',
  styleUrl: './edit-carrusel-page.component.css'
})
export class EditCarruselPageComponent {

  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef>

  visible: boolean = false;
  movieCarrusel?: MovieCarrusel;

  listMovies: MovieCarrusel[] = [];

  baseUrl = environments.baseUrl;

  listUpdates: MovieCarrusel[] = [];
  existingIds = new Set<number>();
  loading = false;

  public editForm!: FormGroup;

  constructor(
    private administrationService: AdministrationService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      posterUrl: ['', Validators.required],
  })
  }

  ngOnInit(): void {
    this.loadCarruselData();
  }

  showDialog(movie: MovieCarrusel) {

    this.movieCarrusel = movie
    this.visible = true;
  }

  closeDialog(){
    this.editForm.reset();
  }

  onChangesInput(){

    const movieCarrsuelId = this.movieCarrusel?.id
    const posterUrl = this.editForm.get("posterUrl")?.value

    this.administrationService.updateMoviePoster( Number(movieCarrsuelId), posterUrl).subscribe({
      next: (resp) => {
        console.log(resp);
        this.loadCarruselData();
      },
      error: (error) => {
        console.log('No se pudo actualizar el poster', error);
      }
    })

  }

  private loadCarruselData(): void {

    this.loading = true;

    this.administrationService.getMovieCarrusel().subscribe({
      next: (resp: ListsCarrusel) => {

        this.listMovies = resp.filterMovies;

        this.listUpdates = resp.moviesCarrusel.sort((a, b) => a.position - b.position);

        this.updateExistingIds();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar el carrusel'
        });
        this.loading = false;
      }
    });
  }

  private updateExistingIds(): void {
    this.existingIds = new Set(this.listUpdates.map(m => m.externalMovieId));
  }

  onMoveToTarget(event: any): void {
    const newItems = event.items.filter((item: MovieCarrusel) =>
      !this.existingIds.has(item.externalMovieId)
    );

    if (newItems.length === 0) return;

    // Crea un array de *Observables*, no de suscripciones
    const requests = newItems.map((item: MovieCarrusel) => {
      return this.administrationService.addItemToCarrusel(
        item.externalMovieId.toString(),
        this.listUpdates.length + 1,
        ''
      );
    });

    // Suscribirnos *una sola vez* con forkJoin
    forkJoin(requests).subscribe({
      next: (resp) => {
        // `resp` es un array con las respuestas de cada observable
        console.log(resp);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Elementos agregados correctamente',
        });
        this.loadCarruselData();
      },
      error: (err) => {
        console.error('Error:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al agregar elementos',
        });
      },
    });
  }

  onMoveToSource(event: any): void {

    const itemsToRemove = event.items as MovieCarrusel[];

    const requests = itemsToRemove.map(item =>
      this.administrationService.removeItemCarrusel(item.externalMovieId)
    );

    forkJoin(requests).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Elementos eliminados correctamente'
        });
        this.loadCarruselData();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar elementos'
        });
      }
    });
  }

  upPositionPoster(event: any){

     // 1) Asigna position según el orden actual del array
    this.listUpdates.forEach((item, index) => {
      item.position = index + 1;
    });

    const posterUpdate: MovieCarrusel[] = event.items

    forkJoin(

      posterUpdate.map(item =>
        this.administrationService.updatePosterPosition(item.id, item.position)
      )
    ).subscribe({
      next: (responses) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Orden actualizado',
          detail: 'La posición de los posters se ha actualizado correctamente'
        });
        // Refresca la data con la nueva lista ordenada
        this.loadCarruselData();
      },
      error: (err) => {
        console.error('Error actualizando el orden:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el orden'
        });
      }
    });

  }

  async updatePosterPosition(event: any){

    const listMoviePoster: MovieCarrusel[] = event.items

    for (const moviePoster of listMoviePoster) {

      this.administrationService.updatePosterPosition(moviePoster.id,moviePoster.position).subscribe({
        next: (resp) => {
          this.loadCarruselData();
        },
        error: (err) => {
          console.error('Error:', err);
        }
      })

    }

  }

}
