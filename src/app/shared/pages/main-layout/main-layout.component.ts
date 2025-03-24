import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from '../../../users/interfaces/user.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Region, SharedService } from '../../services/shared.service';
import * as stringSimilarity from 'string-similarity';
import { MatOptionSelectionChange } from '@angular/material/core';
import { StorageService } from '../../../storage/storage.service';

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
    private storageService: StorageService

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

    // Se actualizan las regiones
    this.sharedService.allRegions.subscribe({
      next: (resp)=> {
        this.regions = resp
      },
      error: (error)=> {
        console.log('No se logro actualizar las regiones', error);
      }
    })

    // Se obtiene y actualiza la ubicacion actual del usuario
    this.storageService.getData("user_ubication").subscribe({
      next: (resp)=> {
        this.userCurrentRegion = resp!

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
      },
      error: (error)=> {
        console.log(error);
      }
    })

    this.cdr.detectChanges();

  }

  onChangeUbication(newUbication: string): void {

    this.storageService.saveData("user_ubication", newUbication).subscribe({
      next: ()=> {
        console.log('Ubicacion actualizada correctamente');
      },
      error: ()=> {
        console.log('La ubicacion no pudo actualizarse correctamente');
      }
    })

    window.location.reload();

    const regionsName = this.regions.map( region => region.name);

    this.storageService.getData("user_ubication").subscribe({
      next: (resp)=> {

        const currentRegionSession = resp

        const result = stringSimilarity.findBestMatch(currentRegionSession!, regionsName);
        const bestMatch = result.bestMatch;

        console.log(this.userCurrentRegion)
        console.log(bestMatch.target)
        this.userCurrentRegion = bestMatch.target;

        this.cdr.detectChanges();
      },
      error: (error)=> {
        console.log(error);
      }
    })

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
