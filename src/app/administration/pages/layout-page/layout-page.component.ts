import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-layout-page',
  standalone: false,

  templateUrl: './layout-page.component.html',
  styleUrl: './layout-page.component.css'
})
export class LayoutPageComponent implements OnInit{

  items!: MenuItem[];

  ngOnInit(): void {

    this.items = [
      {
          icon: 'pi pi-pencil',

      },
      {
          icon: 'pi pi-refresh',

      },
      {
          icon: 'pi pi-trash',

      },
    ];

  }





}
