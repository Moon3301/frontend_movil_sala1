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
    
  }



}
