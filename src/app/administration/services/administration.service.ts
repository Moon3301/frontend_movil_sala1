import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { Company } from '../interfaces/movies.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  constructor(private readonly http: HttpClient) { }

  getMoviesForCompany(): Observable<Company[]>{
    return this.http.get<Company[]>(`${environments.baseUrl}/version`)
  }

}
