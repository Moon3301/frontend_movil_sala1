import { Inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { firstValueFrom, Observable, switchMap, take } from 'rxjs';
import { environments } from '../../../environments/environments';
import { StorageService } from '../../storage/storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(@Inject(StorageService) private storageService: StorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return this.storageService.getData('access_token').pipe(
      take(1),                              // sólo el primer valor y completamos
      switchMap(token => {
        
        /* 2. si aplica, clonamos con el header */
        if (req.url.startsWith(`${environments.baseUrl}/user`) && token != null) {
          const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
          });
          return next.handle(authReq);
        }

        /* 3. si no hay token o URL no coincide, seguimos tal cual */
        return next.handle(req);
      })
    );
  }
}

