import { Injectable, OnInit } from "@angular/core";
//import { Storage } from '@capacitor/storage';
import { from, map, Observable } from "rxjs";
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService{

  saveData(key: string, value: string): Observable<void> {
    return from(
      Preferences.set({ key, value })
    );
  }

  getData(key: string): Observable<string | null> {
    return from(Preferences.get({ key })).pipe(
      map(response => response.value) // string | null
    );
  }

  deleteData(key: string): Observable<void> {
    return from(
      Preferences.remove({ key })
    );
  }

  cleanAllData(): Observable<void> {
    return from(
      Preferences.clear()
    );
  }

}
