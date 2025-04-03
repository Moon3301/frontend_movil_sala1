import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StorageService } from '../../../storage/storage.service';
import { Region, SharedService } from '../../../shared/services/shared.service';
import * as stringSimilarity from 'string-similarity';

@Component({
  selector: 'movie-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  regions: Region[] = []

  userCurrentRegion!: string;

  constructor(
    private storageService: StorageService,
    private cdr: ChangeDetectorRef,
    private sharedService: SharedService

  ){}

  ngOnInit(): void {

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

    // Se actualizan las regiones
    this.sharedService.allRegions.subscribe({
      next: (resp)=> {
        this.regions = resp
      },
      error: (error)=> {
        console.log('No se logro actualizar las regiones', error);
      }
    })

    this.cdr.detectChanges();

  }

  onChangeUbication(newUbication: string): void {

    this.storageService.saveData("user_ubication", newUbication).subscribe({
      next: ()=> {
        // console.log('Ubicacion actualizada correctamente');
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

        this.userCurrentRegion = bestMatch.target;

        this.cdr.detectChanges();
      },
      error: (error)=> {
        console.log(error);
      }
    })

  }

  onToggleDrawer(): void {
    this.sharedService.toggleDrawer();
  }


}
