import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from '../../../users/interfaces/user.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: false,

  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit{

  logging: boolean = false;

  currentUser!: User | undefined;

  constructor(private readonly authService: AuthService, private router: Router){}

  ngOnInit(): void {

    this.authService.checkAuthentication().subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.currentUser = this.authService.currentUser;
      } else {
        this.currentUser = undefined;
      }
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
