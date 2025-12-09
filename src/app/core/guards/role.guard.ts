// src/app/core/guards/role.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { UserRole } from '../enums/user-role.enum';

export const roleGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notifications = inject(NotificationService);

  const requiredRoles = route.data?.['roles'] as UserRole[] | undefined;

  // Se não tiver roles configuradas, libera o acesso.
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // currentUser é um Signal<UserModel | null> → pegar snapshot
  const user = authService.currentUser();

  if (!user) {
    notifications.warning('Você precisa estar autenticado para acessar este módulo.');
    return router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  // UserModel expõe o enum via roleKey (UserRole)
  const userRole = user.roleKey;

  const hasRole = requiredRoles.includes(userRole);

  if (!hasRole) {
    notifications.warning('Você não tem permissão para acessar este módulo.');
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};
