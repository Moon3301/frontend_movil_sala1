import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environments } from '../environments/environments';
import { IUbication } from './common/interfaces';
import { Observable } from 'rxjs';
import { AuthService } from './auth/services/auth.service';
import { Region, SharedService } from './shared/services/shared.service';
import stringSimilarity from 'string-similarity';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  regions: Region[] = []
  constructor(private readonly http: HttpClient, private readonly authService: AuthService, private sharedService: SharedService){}

  ngOnInit(): void {

    this.getAllRegions().subscribe({
      next: (resp) => {
        this.regions = resp
        localStorage.setItem("regions", JSON.stringify(this.regions))
      },
      error: (error) => {
        console.log(error);
      }
    })

    const ubicationSession = sessionStorage.getItem("user_ubication")
    console.log('ubicationSession: ', ubicationSession)
    if(!ubicationSession){
      this.getUserLocation();
    }

    this.authService.checkAuthentication()
    .subscribe( ()=>{
      console.log('CheckAuthentication finished');
      }
    )

  }

  async getUserLocation(){

    navigator.geolocation.getCurrentPosition(
      (position)=> {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        this.getUbicationByGeoCode(lat, lng).subscribe(response => {

          console.log(response);

          //localStorage.setItem("user_ubication",response.address.state)
          sessionStorage.setItem("user_ubication",response.address.state)

        })
      }
    )
  }

  getAllRegions(): Observable<Region[]>{
    return this.http.get<Region[]>(`${environments.baseUrl}/region`)
  }

  getUbicationByGeoCode(lat: number, lng: number): Observable<IUbication>{
    return this.http.get<IUbication>(`${environments.urlGeoCode}reverse?lat=${lat}&lon=${lng}&api_key=${environments.apiKeyGeoCode}`)
  }

}
