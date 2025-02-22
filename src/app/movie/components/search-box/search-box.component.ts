import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { Movie } from '../../interfaces/movie.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'movie-search-box',
  standalone: false,

  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.css'
})
export class SearchBoxComponent implements OnInit{

  @Input()
  movies: Movie[] = []

  myControl = new FormControl('');

  filteredOptions?: Observable<Movie[]>;

  constructor(private router: Router){}

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),

    );
  }

  private _filter(value: string): Movie[] {
    const filterValue = value.toLowerCase();

    return this.movies.filter(option => option.title.toLowerCase().includes(filterValue));
  }

  redirectToMovie(value: Movie){

    console.log(value);
    this.router.navigate(['movies', value.id])

  }

}
