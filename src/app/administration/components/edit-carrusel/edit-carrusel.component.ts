import { ChangeDetectorRef, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { MessageService } from 'primeng/api';
import { environments } from '../../../../environments/environments';
import { ListsCarrusel, MovieCarrusel } from '../../interfaces/movies.interface';
import { AdministrationService } from '../../services/administration.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'administration-edit-carrusel',
  standalone: false,

  templateUrl: './edit-carrusel.component.html',
  styleUrl: './edit-carrusel.component.css'
})
export class EditCarruselComponent {

  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef>

  listMovies: MovieCarrusel[] = [];

  baseUrl = environments.baseUrl;

  listUpdates: MovieCarrusel[] = [];
  existingIds = new Set<number>();
  loading = false;

  constructor(
    private administrationService: AdministrationService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCarruselData();
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

  triggerFileInput(product: any) {
    const input = this.fileInputs.find((_, index) =>
      this.listUpdates[index] === product
    )?.nativeElement;

    if (input) {
      input.click();
    }
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

  downPositionPoster(event: any){
    const reorderedList: MovieCarrusel[] = event.items;
    // Asume que el pickList ya actualizó el array con la nueva posición (si no, puedes re-calcularla)
    // Si no se actualizan automáticamente las posiciones, puedes asignarlas:
    reorderedList.forEach((item, index) => item.position = index + 1);

    forkJoin(
      reorderedList.map(item =>
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

    console.log('update position poster', event.items)

    const listMoviePoster: MovieCarrusel[] = event.items

    for (const moviePoster of listMoviePoster) {

      console.log(`moviePoster.id: ${moviePoster.id}, moviePoster.position: ${moviePoster.position}`);

      this.administrationService.updatePosterPosition(moviePoster.id,moviePoster.position).subscribe({
        next: (resp) => {
          console.log('Nueva lista de pósters:', resp);

          this.loadCarruselData();
        },
        error: (err) => {
          console.error('Error:', err);
        }
      })

    }

    // this.administrationService.updatePosterPosition(id,newPosition).subscribe({
    //   next: (resp) => {
    //     console.log('Nueva lista de pósters:', resp);

    //     this.loadCarruselData();
    //   },
    //   error: (err) => {
    //     console.error('Error:', err);
    //   }
    // })

  }

  async handleFileUpload(event: Event, movieCarrusel: MovieCarrusel) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      try {
        // 1. Mostrar preview inmediata
        const previewUrl = await this.readFileAsDataURL(file);
        movieCarrusel.poster_url = previewUrl;

        console.log('movieCarrusel:', movieCarrusel);

        // Armamos FormData
        const formData = new FormData();
        formData.append('poster', file); // El nombre 'poster' debe coincidir con FileInterceptor('poster')
        formData.append('id', movieCarrusel.id.toString() || '');

        // Llamamos a la nueva ruta de NestJS
        this.administrationService.uploadMoviePoster(formData).subscribe({
          next: (resp) => {

            movieCarrusel.poster_url = resp.poster_url
            this.loadCarruselData();
          },
          error: (err) => {
            console.error('Error:', err);
          },
        });

      } catch (error) {
        console.error('Error uploading image:', error);
        // Manejar errores
      }
    }
  }

  private readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  buildPosterUrl(posterUrl: string): String{
    return `${this.baseUrl}/uploads/${posterUrl}`
  }
}
