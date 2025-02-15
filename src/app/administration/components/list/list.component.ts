import { Component } from '@angular/core';

interface Movie {
  id: number
  title: string
  director: string
  year: number
  isNewRelease: boolean
}

@Component({
  selector: 'administration-list',
  standalone: false,

  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {


}
