// src/app/core/interceptors/error.interceptor.ts

import { inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notifications = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        notifications.error('Sua sessão expirou. Faça login novamente.');
        router.navigate(['/auth/login']);
      } else if (error.status === 403) {
        notifications.warning('Você não tem permissão para executar esta ação.');
      } else if (error.status >= 500) {
        notifications.error('Erro interno no servidor. Tente novamente em alguns instantes.');
      }

      return throwError(() => error);
    }),
  );
};
