import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StorageService } from '../../../storage/storage.service';
import { SharedService } from '../../../shared/services/shared.service';
import * as stringSimilarity from 'string-similarity';
import { Capacitor } from '@capacitor/core';
import { IRegion } from '../../../common/interfaces';
import { catchError, combineLatest, debounceTime, distinctUntilChanged, forkJoin, from, map, of, switchMap, take, tap } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';
import { FilterService } from '../../../shared/services/filter.service';
import { Movie } from '../../interfaces/movie.interface';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'movie-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',

})
export class HeaderComponent implements OnInit {

  showFilter = false;

  readonly isAndroid = Capacitor.getPlatform() === 'android';

  regions: IRegion[] = []
  cadenas: any[] = []
  cines: any[] = []

  moviesFilter: Movie[] = []

  persistedRegionId: number | null = null;

  userCurrentRegion: string = 'Seleccione una region';
  userCurrentCadena: string = 'Seleccione una cadena';
  userCurrentCine: string = 'Seleccione un cine';

  userCurrentUbication = {
    name: '',
    icon: ''
  }

  constructor(
    private storageService: StorageService,
    private cdr: ChangeDetectorRef,
    private sharedService: SharedService,
    private filter: FilterService,
    private movieService: MovieService

  ){}

  ngOnInit(): void {

    this.sharedService.selectedIconFilter$.subscribe({
      next: (resp)=> {
        this.userCurrentUbication.icon = resp!
      },
      error: (error)=> {
        console.log(error);
      }
    })

    this.sharedService.selectedNameFilter$.subscribe({
      next: (resp)=> {
        this.userCurrentUbication.name = resp!
      },
      error: (error)=> {
        console.log(error);
      }
    })

    this.storageService.getData("filterDataName").subscribe({next: (resp) => this.sharedService.setNameOptionFilter(resp!)})
    this.storageService.getData("filterDataIcon").subscribe({next: (resp) => this.sharedService.setIconOptionFilter(resp!)})

    // Se obtiene y actualiza la ubicacion actual del usuario
    this.storageService.getData("user_ubication").subscribe({
      next: (resp)=> {
        this.userCurrentRegion = resp!
        console.log('Region actualizada',resp)
        if (!this.userCurrentRegion){

          this.sharedService.getUserLocation().subscribe({
            next: (resp) => {

              this.userCurrentRegion = resp
              this.cdr.detectChanges();

            },
            error: (error) => {
              console.log(error);
            }
          })
        }
      },
      error: (error)=> {
        console.log(error);
      }
    })

    // Se actualizan las regiones
    this.sharedService.allRegions.subscribe({
      next: (resp)=> {
        this.regions = resp
      },
      error: (error)=> {
        console.log('No se logro actualizar las regiones', error);
      }
    })

    /* 1️⃣  cargar valores persistidos en paralelo */
    forkJoin({
      regionId:  this.storageService.getData('user_region_id'),
      chain:     this.storageService.getData('user_chain'),
      cinemaId:  this.storageService.getData('user_cinema_id'),
      cinemaName:this.storageService.getData('user_cinema_name')
    }).pipe(take(1)).subscribe(({ regionId, chain, cinemaId, cinemaName }) => {

      /* — Región —————————————————————— */
      if (regionId) {
        this.persistedRegionId = +regionId;
        this.filter.setRegion(+regionId);

        /* además muevo el nombre a la UI si lo tienes guardado en otro lado */
        this.sharedService.allRegions.pipe(take(1)).subscribe(list => {
          const found = list.find(r => r.id === +regionId);
          if (found) this.userCurrentRegion = found.name;
        });
      }

      /* — Cadena —————————————————————— */
      if (chain) {
        this.userCurrentCadena = chain;
        this.filter.setChain(chain);

        /*  cargar lista de cines antes de intentar setear el cine  */
        this.sharedService
          .getCinesByChainAndRegion(chain, +regionId!)
          .pipe(take(1))
          .subscribe(cines => {
            this.cines = cines;

            /* — Cine ———————————————————— */
            if (cinemaId && cinemaName) {
              this.userCurrentCine = cinemaName;
              this.filter.setCinema(+cinemaId);
            }
            this.cdr.detectChanges();
          });
      }

    });

    // ########################## START TEST ############################# //

    combineLatest([
      this.filter.selectedRegion$,
      this.filter.selectedChain$
    ]).pipe(
      distinctUntilChanged(),
      switchMap(([regionId, chain]) => {
        // ➊  Cargar cadenas cuando cambia la región
        if (regionId && !chain) {
          return this.sharedService.getChainsByRegion(regionId).pipe(
            tap(cadenas => this.cadenas = cadenas)
          );
        }
        // ➋  Cargar cines cuando cambia la cadena
        if (regionId && chain) {
          return this.sharedService.getCinesByChainAndRegion(chain, regionId).pipe(
            tap(cines => this.cines = cines)
          );
        }
        return of(null);
      })
    ).subscribe(() => this.cdr.markForCheck());

    // ######################## END TEST ############################### //

    this.storageService.getData("coordenates").subscribe({
      next: (resp)=> {
        console.log('Coordenadas',resp)
        if (!resp) return;

        const coordenadas = JSON.parse(resp!)
        this.sharedService.getUbicationByServer(coordenadas.latitude.toString(), coordenadas.longitude.toString()).subscribe({
          next: (resp)=> {
            console.log(resp)
            this.onSelectRegion(resp)
            this.onFilterMovies();
          },
          error: (error)=> {
            console.log(error);
          }
        })
      },
      error: (error)=> {
        console.log(error);
      }
    })

    this.cdr.detectChanges();

  }

  onSelectRegion(region: IRegion) {

    this.userCurrentRegion = region.name;
    this.filter.setRegion(region.id);

    forkJoin([
      this.storageService.saveData('user_region_id', String(region.id)),
    ]).subscribe();




    this.userCurrentUbication.name = region.name;
    this.userCurrentUbication.icon = 'location_on';
    this.storageService.saveData("filterDataName", this.userCurrentUbication.name).subscribe();
    this.storageService.saveData("filterDataIcon", this.userCurrentUbication.icon).subscribe();
  }

  resetChain() {
    this.userCurrentCadena = 'Seleccione una cadena';

    this.filter.resetChain();
    this.resetCinema();
  }

  resetCinema() {
    this.userCurrentCine = 'Seleccione un cine';
    this.filter.resetCinema();
  }

  resetFilter() {
    this.userCurrentRegion = 'Seleccione una region';
    this.userCurrentCadena = 'Seleccione una cadena';
    this.userCurrentCine = 'Seleccione un cine';
    this.filter.resetChain();
    this.filter.resetCinema();

    forkJoin([
      this.storageService.deleteData('user_region_id'),
      this.storageService.deleteData('user_chain'),
      this.storageService.deleteData('user_cinema_id'),
      this.storageService.deleteData('user_cinema_name')
    ]).subscribe();
  }

  onSelectChain(chain: any) {
    this.userCurrentCadena = chain.ci_type;
    this.filter.setChain(chain.ci_type);

    /* persistir */
    this.storageService.saveData('user_chain', chain.ci_type).subscribe();

    this.userCurrentUbication.name = chain.ci_type;
    this.userCurrentUbication.icon = 'local_activity';

    this.storageService.saveData("filterDataName", this.userCurrentUbication.name).subscribe();
    this.storageService.saveData("filterDataIcon", this.userCurrentUbication.icon).subscribe();
  }

  onSelectCinema(cinema: any) {
    this.userCurrentCine = cinema.name;
    this.filter.setCinema(cinema.id);

    /* persistir */
    this.storageService.saveData('user_cinema_id', String(cinema.id)).subscribe();
    this.storageService.saveData('user_cinema_name', cinema.name).subscribe();

    this.userCurrentUbication.name = cinema.name;
    this.userCurrentUbication.icon = 'theaters';

    this.storageService.saveData("filterDataName", this.userCurrentUbication.name).subscribe();
    this.storageService.saveData("filterDataIcon", this.userCurrentUbication.icon).subscribe();
  }

  onChangeUbication(newUbication: IRegion): void {

    this.storageService.saveData("user_ubication", newUbication.name).subscribe({
      next: ()=> {
        this.userCurrentRegion = newUbication!.name
        this.sharedService.setRegion(newUbication.name);

        const coordenates = {
          latitude: newUbication.latitude,
          longitude: newUbication.longitude
        }

        this.storageService.saveData('coordenates', JSON.stringify(coordenates)).subscribe({
          next: () => console.log('Coordenadas guardadas en el almacenamiento local'),
          error: (error) => console.error('Error al guardar coordenadas:', error)
        })

        // console.log('Ubicacion actualizada correctamente');
      },
      error: ()=> {
        console.log('La ubicacion no pudo actualizarse correctamente');
      }
    })

    this.cdr.detectChanges();

    const regionsName = this.regions.map( region => region.name);

    this.storageService.getData("user_ubication").subscribe({
      next: (resp)=> {

        const currentRegionSession = resp

        const result = stringSimilarity.findBestMatch(currentRegionSession!, regionsName);
        const bestMatch = result.bestMatch;

        this.userCurrentRegion = bestMatch.target;

        this.cdr.detectChanges();
      },
      error: (error)=> {
        console.log(error);
      }
    })

  }

  onFilterMovies() {
    combineLatest([
      this.filter.selectedRegion$,
      this.filter.selectedChain$,
      this.filter.selectedCinema$
    ]).pipe(
      take(1), // sólo una vez cuando haces clic en “Aceptar”
      switchMap(([regionId, chain, cinemaId]) =>
        this.movieService.getFilterMovies(regionId, chain, cinemaId)
      ),
      tap(movies => this.moviesFilter = movies)
    ).subscribe(
      {
        next: (resp)=> {
          console.log(resp);
          this.onToggleFilter();
        },
        error: (error)=> {
          console.log(error);
        }
      }
    );
  }

  getUserLocationANDROID() {
    const DEFAULT_LOCATION = 'Metropolitana de Santiago'; // El valor por defecto que desees

    return from(Geolocation.checkPermissions()).pipe(
      switchMap(permissions => {
        if (permissions.location === 'denied') {
          // El usuario no otorgó permiso aún: se solicita
          return from(Geolocation.requestPermissions());
        }
        return of(null);
      }),
      switchMap(() => from(Geolocation.getCurrentPosition())),
      switchMap((position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        // Llamada a la API que, dado lat/lng, devuelve un Observable con la ubicación

        const coordenates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }

        this.storageService.saveData('coordenates', JSON.stringify(coordenates)).subscribe({
          next: () => console.log('Coordenadas guardadas en el almacenamiento local'),
          error: (error) => console.error('Error al guardar coordenadas:', error)
        })

        return this.sharedService.getUbicationByServer(lat.toString(), lng.toString());
      }),
      switchMap(response => {
        // Guardar la ubicación real en storage
        return this.storageService.saveData('user_ubication', response.name).pipe(
          // Encadena y retorna la ubicación guardada
          switchMap(() => this.storageService.getData('user_ubication'))
        );
      }),
      tap(saved => {
        console.log('Ubicación guardada en el almacenamiento local:', saved);
        // A la vez, actualizamos BehaviorSubject o tu service
        this.sharedService.setRegion(saved!);
      }),
      catchError(err => {
        console.error('Error al obtener ubicación:', err);

        // === AQUÍ asignamos el valor por defecto ===
        return this.storageService.saveData('user_ubication', DEFAULT_LOCATION).pipe(
          tap(() => {
            console.log('Ubicación guardada por defecto:', DEFAULT_LOCATION);
            this.sharedService.setRegion(DEFAULT_LOCATION);
          }),
          // Devolvemos algo para que el flujo continúe y no rompa
          // Por ejemplo, devolvemos un string con la ubicación por defecto
          map(() => DEFAULT_LOCATION)
        );
      })
    );
  }

  onToggleDrawer(): void {
    this.sharedService.toggleDrawer();
  }

  onToggleFilter(): void {
    this.showFilter = !this.showFilter;
  }


}
