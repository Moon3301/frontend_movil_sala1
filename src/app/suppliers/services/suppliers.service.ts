import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../../storage/storage.service';
import { environments } from '../../../environments/environments';
import { ISupplier, Supplier } from '../interfaces/supplier.interface';
import { map, Observable, switchMap } from 'rxjs';
import { Movie } from '../../movie/interfaces/movie.interface';
import { Promotion } from '../interfaces/promotions.interface';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  getSupplierByUserId(): Observable<ISupplier> {
    // Suponiendo que storageService.getData devuelve un Observable<string>
    return this.storageService.getData('userLogged').pipe(
      map(userStr => JSON.parse(userStr!)), // convierte el string a objeto
      switchMap((user: any) =>
        this.http.get<ISupplier>(`${environments.baseUrl}/suppliers/user/${user.userId}`)
      )
    );
  }

  getMoviesByCompany(company: string){
    return this.http.get<Movie[]>(`${environments.baseUrl}/movies/by-company?company=${company}`)
  }

  getCinemasByCompany(company: string){
    return this.http.get<any[]>(`${environments.baseUrl}/cinemas/by-company?company=${company}`)
  }

  createSupplier(supplier: Supplier){
    return this.http.post<Supplier>(`${environments.baseUrl}/suppliers`, supplier)
  }

  updateSupplier(supplier: Supplier){
    const userId = this.storageService.getData('userLogged')
    return this.http.put<Supplier>(`${environments.baseUrl}/suppliers/user/${userId}`, supplier)
  }

  createPromotion(promotion: Promotion){
    return this.http.post<Promotion>(`${environments.baseUrl}/suppliers/promotion`, promotion)
  }


}
