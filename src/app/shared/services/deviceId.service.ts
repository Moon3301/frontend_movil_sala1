import { Injectable } from "@angular/core";
import { Device } from '@capacitor/device';
import { from, of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceIdService{

  private readonly KEY = 'sala1_device_id';
  private id!: string;

  constructor(){}

  getId(): Observable<string> {
    if (this.id) return of(this.id);

    const produceId = async (): Promise<string> => {
      const stored = localStorage.getItem(this.KEY);
      if (stored) {
        this.id = stored;
        return stored;
      }

      // Capacitor nativo
      if ((window as any).Capacitor) {
        const { identifier } = await Device.getId();
        localStorage.setItem(this.KEY, identifier);
        this.id = identifier;
        return identifier;
      }

      // Web
      const uuid = crypto.randomUUID();
      localStorage.setItem(this.KEY, uuid);
      this.id = uuid;
      return uuid;
    };

    return from(produceId());
  }
}


