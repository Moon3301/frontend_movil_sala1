import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AdministrationService } from '../../services/administration.service';
import { Company, Movie } from '../../interfaces/movies.interface';

@Component({
  selector: 'app-list-movies',
  standalone: false,

  templateUrl: './list-movies.component.html',
  styleUrl: './list-movies.component.css'
})
export class ListMoviesComponent implements OnInit {

  companies!: Company[]

  listUpdates: Movie[] = []

  displayedColumns: string[] = ["company", "title", "isNewRelease"]
  dataSource!: MatTableDataSource<Movie>

  constructor(private readonly administrationService: AdministrationService){
    // this.dataSource = new MatTableDataSource(this.companies)
  }

  ngOnInit(): void {

    this.administrationService.getMoviesForCompany()
      .subscribe( company => {
        this.companies = company
        console.log(this.companies);
        this.companies.forEach( data => {
          console.log(data.name);

        })
      })
  }

  toggleNewRelease(_movie: Movie) {
    _movie.isPremiere = !_movie.isPremiere

    let indice = this.listUpdates.findIndex( movie => movie.id === _movie.id);

    if(indice !== -1){
      this.listUpdates.splice( indice, 1);

      this.listUpdates.push(_movie);
    }else{
      this.listUpdates.push(_movie);
    }

    console.log(this.listUpdates)
  }

  getAllMoviesByCompany(){
    this.administrationService.getMoviesForCompany()
      .subscribe( company => {
        this.companies = company
        console.log(this.companies);

      })
  }

  updateIsPremiere(){


  }

}
