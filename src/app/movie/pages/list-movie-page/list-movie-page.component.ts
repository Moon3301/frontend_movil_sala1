import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Movie } from '../../interfaces/movie.interface';
import { MovieService } from '../../services/movie.service';
import { MovieCarrusel } from '../../../administration/interfaces/movies.interface';
import { combineLatest, debounceTime, finalize, forkJoin, map, shareReplay, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { FilterService } from '../../../shared/services/filter.service';

@Component({
  selector: 'movie-list-movie-page',
  standalone: false,

  templateUrl: './list-movie-page.component.html',
  styleUrl: './list-movie-page.component.css'
})
export class ListMoviePageComponent implements OnInit{

  @ViewChild('listMoviesContainer') listMoviesContainerRef!: ElementRef;

  isLoading = false;
  movies: Movie[] = []
  moviesFilter: Movie[] = []
  moviesSkeleton = Array.from({ length : 6})

  moviesPremiere: Movie[] = []
  moviesPresale: Movie[] = []
  moviesComingSoon: Movie[] = []

  /** teardown */
  private destroy$ = new Subject<void>();

  // Índice del tab seleccionado
  selectedTabIndex = 0;

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router,
    private filter: FilterService
  ){}

  ngOnInit(): void {

    /** 1️⃣ Cargar carrusel UNA sola vez */
    const carrusel$ = this.movieService.getCarrusel().pipe(
      shareReplay(1)
    );

    /** 2️⃣ Reaccionar a los filtros + carrusel */
    this.isLoading = true;

    combineLatest([
      this.filter.selectedRegion$.pipe(startWith(null)),
      this.filter.selectedChain$.pipe(startWith(null)),
      this.filter.selectedCinema$.pipe(startWith(null)),
      carrusel$
    ]).pipe(
      tap(() => this.isLoading = true),
      debounceTime(0),
      switchMap(([regionId, chain, cinemaId, carrusel]) =>
        this.movieService.getMoviesByFilters(regionId, chain, cinemaId).pipe(
          map(movies => this.combineAndSort(movies, carrusel))
        )
      ),
      tap(sortedMovies => {
        this.populateCategories(sortedMovies);
        this.isLoading = false;
      }),
      takeUntil(this.destroy$)
    ).subscribe();

    /** 3️⃣ Sincronizar pestaña con query */
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(p => this.selectedTabIndex = +p['tab'] || 0);

    /** 4️⃣ CSS extra para iOS */
    if (Capacitor.getPlatform() === 'ios') {
      this.listMoviesContainerRef.nativeElement.classList.add('ios-device');
    }
  }

  onTabChange(event: any) {
    const index = event.index;
    // Navegar a la misma ruta, pero cambiando el query param 'tab'
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: index },
      queryParamsHandling: 'merge' // mantiene los demás query params que existan
    });
  }

  private combineAndSort(allMovies: Movie[], moviesCarrusel: MovieCarrusel[]): Movie[] {
    const positionMap = new Map<string, number>(
      moviesCarrusel.map(c => [String(c.externalMovieId), c.position])
    );

    return [...allMovies].sort((a, b) => {
      const posA = positionMap.get(a.external_id) ?? Infinity;
      const posB = positionMap.get(b.external_id) ?? Infinity;
      return posA - posB;
    });
  }

  private populateCategories(list: Movie[]) {
    this.movies           = list;
    this.moviesPremiere   = list.filter(m => m.screen_type === 'ESTRENO');
    this.moviesPresale    = list.filter(m => m.screen_type === 'PREVENTA');
    this.moviesComingSoon = list.filter(m => m.screen_type === 'PROXIMAMENTE');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
