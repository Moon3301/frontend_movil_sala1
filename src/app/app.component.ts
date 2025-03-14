import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environments } from '../environments/environments';
import { IUbication } from './common/interfaces';
import { Observable } from 'rxjs';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  constructor(private readonly http: HttpClient, private readonly authService: AuthService){}

  ngOnInit(): void {

    const ubication = localStorage.getItem("user_ubication")

    if(!ubication){
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

          localStorage.setItem("user_ubication",response.address.state)

        })
      }
    )
  }

  getUbicationByGeoCode(lat: number, lng: number): Observable<IUbication>{
    return this.http.get<IUbication>(`${environments.urlGeoCode}reverse?lat=${lat}&lon=${lng}&api_key=${environments.apiKeyGeoCode}`)
  }

}
