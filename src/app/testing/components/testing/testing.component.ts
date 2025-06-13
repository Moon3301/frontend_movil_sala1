import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Channel, LocalNotifications, NotificationChannel } from '@capacitor/local-notifications';

@Component({
  selector: 'app-testing',
  standalone: false,

  templateUrl: './testing.component.html',
  styleUrl: './testing.component.css'
})
export class TestingComponent implements OnInit{

  private permissionGranted = false;

  constructor( private readonly router: Router){}

  async ngOnInit() {
    const perm = await LocalNotifications.requestPermissions(); // iOS pregunta; Android concede en install
    this.permissionGranted = (perm.display === 'granted');
    console.log('[Permiso notificaciones]', perm.display);       // 'granted' | 'denied'

    /* 2️⃣  Listener (solo se registra una vez) */
    LocalNotifications.addListener('localNotificationActionPerformed', event => {
      const { id, extra } = event.notification;
      console.log('🟢 Notificación abierta', id, extra);
      if (extra?.promotionId) {
        this.router.navigate(['/users', extra.promotionId]);
      }
    });

  }

  async sendNotification(){

    if (!this.permissionGranted) {
      alert('Activa las notificaciones en Ajustes para recibir avisos.');
      return;
    }

    await this.createChannel();

    await LocalNotifications.schedule({
      notifications: [{
        id: 1,                       // cualquier entero único
        title: '🎬 Función en 30 min',
        body:  'Tu película comienza a las 21:00',
        schedule: { at: new Date(Date.now() + 10_000) }, // 10 s después
        channelId: 'cinema-reminders',   // usa tu propio canal
        // sound: 'beep.wav',           // opcional (colócalo en ios/App/App/assets y android/app/src/main/res/raw)
        // smallIcon: 'ic_stat_sala1',  // opcional (solo Android)
        actionTypeId: '',            // o define tipos para botones de acción
        extra: { promotionId: '29' }      // datos que te servirán al abrirla
      }]
    })
  }

  async createChannel(){
    /* 2️⃣  (Solo Android) Crear un canal propio */
    const channel: Channel = {
      id: 'cinema-reminders',
      name: 'Recordatorios Sala 1',
      description: 'Alertas de funciones cercanas y estrenos',
      importance: 5,        // IMPORTANCE_HIGH
      visibility: 1,        // VISIBILITY_PUBLIC
      vibration: true
    };

    try { await LocalNotifications.createChannel(channel); }
    catch { /* si ya existe, ignoramos */ }
  }

  redirectoToCoupon(){
    this.router.navigate(['/users', '29']);
  }



}
