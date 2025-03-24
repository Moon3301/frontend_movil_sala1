import { Injectable, OnInit } from "@angular/core";
import { Storage } from '@capacitor/storage';
import { from, map, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StorageService implements OnInit{

  constructor(){}

  async ngOnInit(){}

  saveData(key: string, value: string): Observable<void> {
    return from(
      Storage.set({ key, value })
    );
  }

  getData(key: string): Observable<string | null> {
    return from(Storage.get({ key })).pipe(
      map(response => response.value) // string | null
    );
  }

  deleteData(key: string): Observable<void> {
    return from(
      Storage.remove({ key })
    );
  }

  cleanAllData(): Observable<void> {
    return from(
      Storage.clear()
    );
  }

}
