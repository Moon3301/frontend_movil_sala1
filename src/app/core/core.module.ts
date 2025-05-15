// src/app/core/core.module.ts
import { inject, NgModule, provideAppInitializer  } from '@angular/core';
import { PushService } from './push.service';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../primeng/primeng.module';
import { AppVersionService } from './appVersion.service';

export function initPush(push: PushService) {
  return () => push.init();
}

@NgModule({
  imports: [
    CommonModule,
    PrimengModule
  ],
  providers: [
    PushService,
    provideAppInitializer(() => inject(PushService).init()),
    provideAppInitializer(() => inject(AppVersionService).check())
  ],
})
export class CoreModule {}
