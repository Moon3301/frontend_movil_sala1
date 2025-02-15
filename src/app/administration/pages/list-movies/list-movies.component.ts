import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AdministrationService } from '../../services/administration.service';
import { ListsCarrusel, MovieCarrusel } from '../../interfaces/movies.interface';
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-list-movies',
  standalone: false,
  templateUrl: './list-movies.component.html',
  styleUrl: './list-movies.component.css'
})
export class ListMoviesComponent implements OnInit {

  listMovies: MovieCarrusel[] = [];
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

    const requests = newItems.map((item: MovieCarrusel) =>
      this.administrationService.addItemToCarrusel(
        item.externalMovieId,
        this.listUpdates.length + 1 // Posición al final
      )
    );

    forkJoin(requests).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Elementos agregados correctamente'
        });
        this.loadCarruselData();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al agregar elementos'
        });
      }
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

}
