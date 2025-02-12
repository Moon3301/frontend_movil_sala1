import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../../../environments/environments';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('access_token');

    if (req.url.startsWith(`${environments.baseUrl}/user`) && token) {

      console.log('Interceptando solicitud hacia url: ', req.url);

      console.log('Agregando token a header');

      const clonedRequest = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`) // Usa backticks (`)
      });
      return next.handle(clonedRequest);
    }

    return next.handle(req);
  }
}

