import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  standalone: false,

  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  public loginForm!: FormGroup;

  constructor(private readonly router: Router, private readonly authService: AuthService, private fb: FormBuilder){

    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  navigateToRegister(){
    this.router.navigate(['new-account'])
  }

  login(){

    console.log('login');

    if (this.loginForm.invalid) return;

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    console.log(email, password);

    this.authService.login(email, password).subscribe( (resp: any) => {
      if(resp.access_token){

        this.router.navigate(['/movies', 'list'])

      }
    })
  }


}
