import { Component, OnInit } from '@angular/core';
import { CineFeature, mapBoxNearbyService } from '../../../shared/services/mapboxNearby.service';
import { Observable, from, switchMap, tap } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'movie-layout-page',
  standalone: false,

  templateUrl: './layout-page.component.html',
  styleUrl: './layout-page.component.css'
})
export class LayoutPageComponent implements OnInit {

  constructor(private mapboxService: mapBoxNearbyService) { }

  ngOnInit(): void {
    // Initialize any necessary data or services here

    this.getUserPosition().subscribe()

  }

  getUserPosition(): Observable<CineFeature[]> {
    return from(Geolocation.getCurrentPosition()).pipe(
      switchMap(pos =>
        this.mapboxService.getNearby( pos.coords.longitude, pos.coords.latitude
        )
      ),
      tap(cines => console.table(cines))   // un único log con el array
    );
  }

}
