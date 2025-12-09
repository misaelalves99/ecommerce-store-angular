// src/app/app.config.ts
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

// 🔹 Firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { FIREBASE_CONFIG } from './core/config/firebase.config';

// 🔹 Lucide (ícones da sidebar)
import {
  LucideAngularModule,
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  Tags,
  Factory,
  TicketPercent,
  Image,
  Boxes,
  Store,
  UserCog,
  ShieldCheck,
} from 'lucide-angular';

import { appRoutes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({
      eventCoalescing: true,
      runCoalescing: true,
    }),

    // 🔹 Rotas
    provideRouter(appRoutes),

    // 🔹 Lucide – registra os ícones usados na app
    importProvidersFrom(
      LucideAngularModule.pick({
        LayoutDashboard,
        ShoppingBag,
        Users,
        Package,
        Tags,
        Factory,
        TicketPercent,
        Image,
        Boxes,
        Store,
        UserCog,
        ShieldCheck,
      }),
    ),

    // 🔹 Firebase App + Auth
    provideFirebaseApp(() => initializeApp(FIREBASE_CONFIG)),
    provideAuth(() => getAuth()),

    // 🔹 HttpClient + interceptors
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, errorInterceptor]),
    ),

    provideAnimations(),
  ],
};
