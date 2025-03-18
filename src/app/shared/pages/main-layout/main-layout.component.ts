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

  constructor(
    private readonly authService: AuthService,
    private router: Router,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef,

  ){}

  ngOnInit(): void {

    // Se verifica la auntenticidad del usuario validando que existen un usuario en localStorage
    this.authService.checkAuthentication().subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.currentUser = this.authService.currentUser;
      } else {
        this.currentUser = undefined;
      }
    });

    this.regions = this.sharedService.allRegions

    this.userCurrentRegion = sessionStorage.getItem("user_ubication")!;
    if (!this.userCurrentRegion){

      this.sharedService.getUserLocation().subscribe({
        next: (resp) => {
          console.log(resp)
          this.userCurrentRegion = resp
          this.cdr.detectChanges();
          sessionStorage.setItem("user_ubication", resp)
        },
        error: (error) => {
          console.log(error);
        }
      })

    }


    // this.regions = JSON.parse(localStorage.getItem("regions")!);

    // const regionsName = this.regions.map( region => region.name);

    // const currentRegionSession = sessionStorage.getItem("user_ubication");

    // const result = stringSimilarity.findBestMatch(currentRegionSession!, regionsName);

    // const bestMatch = result.bestMatch;
    // this.userCurrentRegion = bestMatch.target;
    this.cdr.detectChanges();

    // Se obtiene la lista de regiones desde la BD
    // this.sharedService.getAllRegions().subscribe({
    //   next: (resp) => {
    //     this.regions = resp

    //     const regionsName = this.regions.map( region => region.name);

    //     const currentRegion = localStorage.getItem("user_ubication");
    //     const currentRegionSession = sessionStorage.getItem("user_ubication");

    //     const result = stringSimilarity.findBestMatch(currentRegionSession!, regionsName);

    //     const bestMatch = result.bestMatch;

    //     this.userCurrentRegion = bestMatch.target;
    //     this.cdr.detectChanges();
    //   },
    //   error: (error) => {
    //     console.log(error);
    //   }
    // })



  }

  onChangeUbication(newUbication: string): void {

    //localStorage.setItem("user_ubication", newUbication);
    sessionStorage.setItem("user_ubication", newUbication);

    window.location.reload();
    this.cdr.detectChanges();

    const regionsName = this.regions.map( region => region.name);
    //const currentRegion = localStorage.getItem("user_ubication");
    const currentRegionSession = sessionStorage.getItem("user_ubication");

    const result = stringSimilarity.findBestMatch(currentRegionSession!, regionsName);

    const bestMatch = result.bestMatch;

    this.userCurrentRegion = bestMatch.target;

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
