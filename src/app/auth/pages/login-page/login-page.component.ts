import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastMessagesService } from '../../../toast-messages/toast-messages.service';

@Component({
  selector: 'auth-login-page',
  standalone: false,

  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  public loginForm!: FormGroup;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private fb: FormBuilder,
    private messageService: ToastMessagesService
  ){

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

    this.authService.login(email, password).subscribe({
      next: (resp:any) => {
        console.log(resp);
        if(resp.access_token){
          this.messageService.showToast('Exito', 'Inicio de sesion exitoso', 'success')
          setTimeout(() => {
            this.router.navigate(['/movies', 'list'])
          }, 1000);
        }

        if(resp.status === 401){
          this.messageService.showToast('Error', 'Usuario o contraseña incorrectos', 'error')
        }

        if(resp.status === 500){
          this.messageService.showToast('Error', 'Error al iniciar sesion', 'error')
        }

        if(resp.status === 0){
          this.messageService.showToast('Error', 'Error de servidor, intentelo mas tarde', 'error')
        }
      },
      error: (error) => {
        console.log(error);
        this.messageService.showToast('Error', 'Error al iniciar sesion', 'error')
      }
    })

    // this.authService.login(email, password).subscribe( (resp: any) =>  {


    //   console.log(resp);

    //   if(resp.access_token){
    //     this.router.navigate(['/movies', 'list'])
    //   }else{
    //     this.messageService.showToast('Error', 'No se pudo iniciar sesion', 'error')
    //   }


    // })
  }


}
