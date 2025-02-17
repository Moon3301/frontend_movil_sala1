import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../users/interfaces/user.interface';
import { UserRegister } from '../../interfaces/registerUser';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'auth-register-page',
  standalone: false,
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent implements OnInit{

  public registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private readonly authService: AuthService, private router: Router){

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    })

  }

  ngOnInit(): void {



  }

  register(){

    const user: UserRegister = {
      name: this.registerForm.get('name')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      role: 'visitor'
    }

    this.authService.register(user)
    .subscribe( resp => {
      if(resp){
        console.log('resp register: ',resp);
        this.authService.login(this.registerForm.get('email')?.value, this.registerForm.get('password')?.value)
          .subscribe(resp => {
            if(resp){
              console.log('resp login:',resp);
              this.router.navigate(['movies', 'list'])
            }
          })
      }

    })

  }

  resetValues(){
    this.registerForm.reset();
  }



}
