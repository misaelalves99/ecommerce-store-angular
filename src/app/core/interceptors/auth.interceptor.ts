// src/app/core/interceptors/auth.interceptor.ts

import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const currentUser = authService.currentUser;

  if (!currentUser) {
    return next(req);
  }

  // Tenta achar a propriedade de token mais comum
  const token =
    (currentUser as any).token ??
    (currentUser as any).accessToken ??
    (currentUser as any).jwt ??
    null;

  if (!token) {
    return next(req);
  }

  const cloned = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(cloned);
};
