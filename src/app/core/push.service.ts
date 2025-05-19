// src/app/core/push.service.ts
import { Injectable } from '@angular/core';
import {
  PushNotifications,
  Token,
  PushNotificationSchema,
  ActionPerformed,                     // ← nuevo nombre
  PermissionStatus,
  Channel,                            // typing del objeto canal
  Importance,                         // enum con niveles 1-5
} from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';  // ← aquí vive getInfo()
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, firstValueFrom, of } from 'rxjs';
import { environments } from '../../environments/environments';

interface DeviceDto {
  token: string;
  platform: 'ios' | 'android';
  locale?: string;
  appVersion?: string;
}

@Injectable()
export class PushService {
  private initialized = false;

  constructor(private http: HttpClient, private router: Router) {}

  async init(): Promise<void> {

    if (Capacitor.getPlatform() === 'web') {
      console.info('[Push] plataforma web: se omite PushNotifications');
      return;
    }

    if (this.initialized) return;
    this.initialized = true;

    /* 1️⃣ permisos */
    const perm: PermissionStatus = await PushNotifications.requestPermissions();
    if (perm.receive !== 'granted') {
      console.warn('[Push] permiso denegado');
      return;
    }

    /* 2️⃣ registro */
    await PushNotifications.register();

    PushNotifications.addListener('registrationError', err =>
      console.error('[Push] registrationError', JSON.stringify(err, null, 2))
    );

    /* 3️⃣ token → backend */
    PushNotifications.addListener('registration', async ({ value }: Token) => {
      console.info('[Push] token recibido', value);

      const info = await App.getInfo();               // ← versión y build
      const dto: DeviceDto = {
        token: value,
        platform: Capacitor.getPlatform() as 'ios' | 'android',
        locale: navigator.language ?? 'es-CL',
        appVersion: info.version,
      };
      await firstValueFrom(
        this.http.post(`${environments.baseUrl}/devices`, dto).pipe(
          catchError(err => {
            console.error('[Push] error registrando token', JSON.stringify(err, null, 2));
            return of(null);
        }),
      ),
    );
    });



    /* 4️⃣ notificación en foreground */
    PushNotifications.addListener(
      'pushNotificationReceived',
      (n: PushNotificationSchema) => {
        console.log('[Push] foreground', n.title, n.body);
        // MatSnackBar o PrimeNG toast opcional
      },
    );

    /* 5️⃣ tap en la bandeja */
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (act: ActionPerformed) => {                     // ← nuevo tipo
        const route = act.notification.data?.route;
        if (route) this.router.navigateByUrl(route);
      },
    );

    /* 6️⃣ canal Android (>= Oreo) */
    if (Capacitor.getPlatform() === 'android') {
      const channel: Channel = {
        id: 'sala1_default',
        name: 'Canal General',
        description: 'Notificaciones generales de Sala 1',
        importance: 4,                 // enum 4
        lights: true,
        vibration: true,
      };
      await PushNotifications.createChannel(channel);
    }
  }
}
