// src/app/core/guards/guest.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Permite acesso apenas para visitantes (não autenticados).
 * Se já estiver logado, redireciona para o dashboard.
 */
export const guestGuard: CanActivateFn = (_route, _state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // se NÃO estiver autenticado, pode acessar (ex.: telas de login/registro)
  if (!authService.isAuthenticated()) {
    return true;
  }

  // usuário já autenticado → manda para o dashboard (ou home, se preferir)
  return router.createUrlTree(['/dashboard']);
};
