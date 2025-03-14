import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from 'rxjs';
import { environments } from '../../../environments/environments';

export interface Region {
  id: number,
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private baseUrl: string = environments.baseUrl;

  constructor(private http: HttpClient) {}

  public getAllRegions(): Observable<Region[]>{
    return this.http.get<Region[]>(`${this.baseUrl}/region`)
  }

}
