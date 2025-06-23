import { Injectable } from "@angular/core";
import { BehaviorSubject, distinctUntilChanged } from "rxjs";

@Injectable({ providedIn: 'root' })
export class FilterService {

  private regionId$  = new BehaviorSubject<number | null>(null);
  private chain$     = new BehaviorSubject<string | null>(null);
  private cinemaId$  = new BehaviorSubject<number | null>(null);

  // getters as observables
  selectedRegion$ = this.regionId$.asObservable().pipe(distinctUntilChanged());
  selectedChain$  = this.chain$.asObservable().pipe(distinctUntilChanged());
  selectedCinema$ = this.cinemaId$.asObservable().pipe(distinctUntilChanged());

  get currentRegionId() { return this.regionId$.value; }
  get currentChain()    { return this.chain$.value; }
  get currentCinemaId() { return this.cinemaId$.value; }

  setRegion(id: number|null)  {
    if (this.regionId$.value !== id){
      this.regionId$.next(id);
      this.resetChain();
    }
  }
  setChain(chain: string|null){
    if (this.chain$.value !== chain) {
      this.chain$.next(chain);
      this.resetCinema();
    }
  }
  setCinema(id: number|null){
    if (this.cinemaId$.value !== id) this.cinemaId$.next(id);
  }

  resetChain(){ this.chain$.next(null); this.resetCinema(); }
  resetCinema(){ this.cinemaId$.next(null); }
}
