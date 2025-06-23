import { Component, OnInit } from '@angular/core';
import { mapBoxNearbyService } from '../../../shared/services/mapboxNearby.service';

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
