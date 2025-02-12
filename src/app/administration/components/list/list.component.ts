import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

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

  movies: Movie[] = [
    { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010, isNewRelease: false },
    { id: 2, title: "The Shawshank Redemption", director: "Frank Darabont", year: 1994, isNewRelease: false },
    { id: 3, title: "Oppenheimer", director: "Christopher Nolan", year: 2023, isNewRelease: true },
    { id: 4, title: "Pulp Fiction", director: "Quentin Tarantino", year: 1994, isNewRelease: false },
    { id: 5, title: "Barbie", director: "Greta Gerwig", year: 2023, isNewRelease: true },
  ]

  displayedColumns: string[] = ["title", "director", "year", "isNewRelease"]
  dataSource!: MatTableDataSource<Movie>

  constructor(){
    this.dataSource = new MatTableDataSource(this.movies)
  }

  toggleNewRelease(movie: Movie) {
    movie.isNewRelease = !movie.isNewRelease
    this.dataSource._updateChangeSubscription() // Trigger update
  }

}
