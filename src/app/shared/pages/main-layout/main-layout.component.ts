import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild  } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { User } from '../../../users/interfaces/user.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { Region, SharedService } from '../../services/shared.service';
import * as stringSimilarity from 'string-similarity';
import { StorageService } from '../../../storage/storage.service';
import { MenuItem } from 'primeng/api';
import { Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  standalone: false,

  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit, OnDestroy{

  @ViewChild('drawer') drawer!: MatDrawer;
  private subscription!: Subscription;

  ubicationVisible: boolean = false;

  ptrInstance: any;

  items: MenuItem[] | undefined;

  logging: boolean = false;

  currentUser!: User | undefined;

  regions: Region[] = []

  userCurrentRegion!: string;

  showFiller = false;

  constructor(
    private readonly authService: AuthService,
    // private router: Router,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    private storageService: StorageService

  ){}


  ngOnDestroy(): void {

    if (this.ptrInstance) {
      this.ptrInstance.destroy();
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {

    this.subscription = this.sharedService.toggleDrawer$.subscribe(() => {
      this.drawer.toggle();
    })

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

    this.cdr.detectChanges();

  }

  onToggleDrawer(): void {
    this.drawer.toggle();
  }

  onChangeUbication(newUbication: string): void {
    const regionsNames = this.regions.map(region => region.name);

    this.storageService.saveData('user_ubication', newUbication).pipe(
      switchMap(() => {
        // Una vez guardado, obtén la ubicación
        return this.storageService.getData('user_ubication');
      })
    ).subscribe({
      next: (resp) => {
        // Utiliza stringSimilarity con la ubicación recuperada
        const result = stringSimilarity.findBestMatch(resp!, regionsNames);
        this.userCurrentRegion = result.bestMatch.target;

        // Forzar la detección de cambios si es necesario
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al guardar o recuperar la ubicación:', err);
      },
    });
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
