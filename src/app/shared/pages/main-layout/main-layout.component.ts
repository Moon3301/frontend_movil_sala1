import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from '../../../users/interfaces/user.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Region, SharedService } from '../../services/shared.service';
import * as stringSimilarity from 'string-similarity';
import { MatOptionSelectionChange } from '@angular/material/core';

@Component({
  selector: 'app-main-layout',
  standalone: false,

  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit{

  logging: boolean = false;

  currentUser!: User | undefined;

  regions: Region[] = []
  userCurrentRegion!: string;

  constructor(private readonly authService: AuthService, private router: Router, private sharedService: SharedService){}

  ngOnInit(): void {

    // Se verifica la auntenticidad del usuario validando que existen un usuario en localStorage
    this.authService.checkAuthentication().subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.currentUser = this.authService.currentUser;
      } else {
        this.currentUser = undefined;
      }
    });

    // Se obtiene la lista de regiones desde la BD
    this.sharedService.getAllRegions().subscribe({
      next: (resp) => {
        this.regions = resp

        const regionsName = this.regions.map( region => region.name);
        const currentRegion = localStorage.getItem("user_ubication");

        const result = stringSimilarity.findBestMatch(currentRegion!, regionsName);

        const bestMatch = result.bestMatch;

        this.userCurrentRegion = bestMatch.target;

      },
      error: (error) => {
        console.log(error);
      }
    })

  }

  onChangeUbication(newUbication: string): void {
    localStorage.setItem("user_ubication", newUbication);
    window.location.reload();
  }

  logout(){
    try{
      this.currentUser = undefined;
      this.authService.logout();
    }catch(error){
      console.log(error);
    }
  }


}
