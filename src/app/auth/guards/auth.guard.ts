import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const authService = inject(AuthService);

  const currentUser = authService.currentUser

  if(!currentUser){
    return router.parseUrl('auth/login');
  }else{
    const role = currentUser.role

    if(role === 'Administrador'){
      return true;
    }

  }

  return router.parseUrl('auth/login');
};
