import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class FilterService {

  private regionId$  = new BehaviorSubject<number | null>(null);
  private chain$     = new BehaviorSubject<string | null>(null);
  private cinemaId$  = new BehaviorSubject<number | null>(null);

  // getters as observables
  selectedRegion$ = this.regionId$.asObservable();
  selectedChain$  = this.chain$.asObservable();
  selectedCinema$ = this.cinemaId$.asObservable();

  get currentRegionId()  { return this.regionId$.value; }
  get currentChain()     { return this.chain$.value; }
  get currentCinemaId()  { return this.cinemaId$.value; }

  // setters
  setRegion(id: number|null)  { this.regionId$.next(id);  this.resetChain(); }
  setChain(chain: string|null){ this.chain$.next(chain);  this.resetCinema(); }
  setCinema(id: number|null)  { this.cinemaId$.next(id); }

  // helpers: al cambiar región reseteo niveles inferiores
  public resetChain()  { this.chain$.next(null); this.resetCinema(); }
  public resetCinema() { this.cinemaId$.next(null); }
}
