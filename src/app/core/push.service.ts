// src/app/core/push.service.ts
import { Injectable } from '@angular/core';
import {
  PushNotifications,
  PermissionStatus,
  PushNotificationSchema,
  ActionPerformed,
  Channel,
} from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom, of, catchError } from 'rxjs';
import { environments } from '../../environments/environments';
import { FCM } from '@capacitor-community/fcm';

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
    if (Capacitor.getPlatform() === 'web' || this.initialized) return;
    this.initialized = true;

    /* 1️⃣ Permisos */
    let perm: PermissionStatus = await PushNotifications.checkPermissions();     // ✔ check first
    if (perm.receive !== 'granted') {
      perm = await PushNotifications.requestPermissions();
      if (perm.receive !== 'granted') return;
    }

    /* 2️⃣ Registrar (iOS muestra el diálogo) */
    await PushNotifications.register();

    /* 3️⃣ Token FCM en ambas plataformas */
    const { token } = await FCM.getToken();
    await this.sendToken(token);

    /* 3️⃣.b Auto-refresh */
    FCM.refreshToken()
      .then(({ token }) => this.sendToken(token))
      .catch(err => console.error('[Push] refreshToken error', err));

    /* 4️⃣ Notificación en foreground */
    PushNotifications.addListener('pushNotificationReceived',
      (n: PushNotificationSchema) =>
        console.log('[Push] foreground', n.title, n.body));

    /* 5️⃣ Tap */
    PushNotifications.addListener('pushNotificationActionPerformed',
      (act: ActionPerformed) => {
        const route = act.notification.data?.route;
        if (route) this.router.navigateByUrl(route);
      });

    /* 6️⃣ Canal Android (>= Oreo) */
    if (Capacitor.getPlatform() === 'android') {
      const channel: Channel = {
        id: 'sala1_default',
        name: 'Canal General',
        description: 'Notificaciones generales de Sala 1',
        importance: 4,          // ✔ enum
        lights: true,
        vibration: true,
      };
      await PushNotifications.createChannel(channel);
    }

    /* 7️⃣ Auto-init asegurado */
    await FCM.setAutoInit({ enabled: true });
  }

  /* Método reutilizable */
  private async sendToken(token: string) {
    console.info('[Push] FCM token', token);
    const info = await App.getInfo();
    const dto: DeviceDto = {
      token,
      platform: Capacitor.getPlatform() as 'ios' | 'android',
      locale: navigator.language ?? 'es-CL',
      appVersion: info.version,
    };
    await firstValueFrom(
      this.http.post(`${environments.baseUrl}/devices`, dto).pipe(
        catchError(err => {
          console.error('[Push] error registrando token', err);
          return of(null);
        }),
      ),
    );
  }

  /* Llamar en logout */
  async deleteInstance() {
    await FCM.deleteInstance();
  }
}

