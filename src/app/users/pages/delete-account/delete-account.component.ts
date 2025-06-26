import { Component } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'users-delete-account',
  standalone: false,

  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.css'
})
export class DeleteAccountComponent {

  constructor(private readonly authService: AuthService, private readonly router: Router){}

  deleteAccount(){
    this.authService.deleteAccount().subscribe({
      next: (resp) => {
        console.log(resp);
        this.authService.logout();
        this.router.navigate(['/movies']);
      }
    })
  }

}
