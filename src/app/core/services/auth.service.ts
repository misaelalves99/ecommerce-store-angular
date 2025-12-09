// src/app/core/services/auth.service.ts

import {
  Injectable,
  Signal,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  Auth,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
} from '@angular/fire/auth';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { UserModel } from '../models/user.model';
import { UserRole } from '../enums/user-role.enum';
import { ApiResponse } from '../interfaces/api-response.interface';
import { mapFirebaseAuthErrorToMessage } from '../utils/validation.utils';
import { NotificationService } from './notification.service';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name?: string;
  email: string;
  password: string;
}

/**
 * AuthService unificado (Firebase + Signals + ApiResponse).
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly notifications = inject(NotificationService);

  private static readonly STORAGE_KEY = 'ecommerce-auth-user';

  // ===== STATE (Signals) =====
  private readonly _currentUser: WritableSignal<UserModel | null> =
    signal<UserModel | null>(null);
  private readonly _loading: WritableSignal<boolean> = signal<boolean>(false);
  private readonly _initialized: WritableSignal<boolean> =
    signal<boolean>(false);

  readonly currentUser: Signal<UserModel | null> =
    this._currentUser.asReadonly();
  readonly loading: Signal<boolean> = this._loading.asReadonly();
  readonly isInitialized: Signal<boolean> = this._initialized.asReadonly();

  readonly isAuthenticated: Signal<boolean> = computed(
    () => !!this._currentUser(),
  );

  readonly isAdmin: Signal<boolean> = computed(
    () => this._currentUser()?.roleKey === UserRole.ADMIN,
  );

  constructor() {
    // Opcional: tentar restaurar de localStorage antes do Firebase responder
    this.restoreFromStorage();

    onAuthStateChanged(this.auth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const userModel = this.mapFirebaseUserToUserModel(fbUser);
        this._currentUser.set(userModel);
        this.persist(userModel);
      } else {
        this._currentUser.set(null);
        this.clearPersisted();
      }
      this._initialized.set(true);
    });
  }

  // ====================== LOGIN / REGISTER (Observable) ======================

  login(email: string, password: string): Observable<ApiResponse<UserModel>> {
    this._loading.set(true);

    return from(
      signInWithEmailAndPassword(this.auth, email.trim(), password.trim()),
    ).pipe(
      map((cred) => {
        const userModel = this.mapFirebaseUserToUserModel(cred.user);
        this._currentUser.set(userModel);
        this.persist(userModel);
        this._loading.set(false);

        this.notifications.success('Login realizado com sucesso.');

        return {
          data: userModel,
          success: true,
          message: 'Login realizado com sucesso.',
        } as ApiResponse<UserModel>;
      }),
      this.handleAuthError<UserModel>('Erro ao realizar login.'),
    );
  }

  loginWithPayload(payload: LoginPayload): Observable<ApiResponse<UserModel>> {
    return this.login(payload.email, payload.password);
  }

  register(
    email: string,
    password: string,
    displayName?: string,
  ): Observable<ApiResponse<UserModel>> {
    this._loading.set(true);

    return from(
      createUserWithEmailAndPassword(
        this.auth,
        email.trim(),
        password.trim(),
      ),
    ).pipe(
      map((cred) => {
        const userModel = this.mapFirebaseUserToUserModel(
          cred.user,
          displayName,
        );
        this._currentUser.set(userModel);
        this.persist(userModel);
        this._loading.set(false);

        this.notifications.success('Conta criada com sucesso.');

        return {
          data: userModel,
          success: true,
          message: 'Conta criada com sucesso.',
        } as ApiResponse<UserModel>;
      }),
      this.handleAuthError<UserModel>('Erro ao registrar usuário.'),
    );
  }

  registerWithPayload(
    payload: RegisterPayload,
  ): Observable<ApiResponse<UserModel>> {
    return this.register(payload.email, payload.password, payload.name);
  }

  loginWithGoogle(): Observable<ApiResponse<UserModel>> {
    this._loading.set(true);
    const provider = new GoogleAuthProvider();

    return from(signInWithPopup(this.auth, provider)).pipe(
      map((cred) => {
        const userModel = this.mapFirebaseUserToUserModel(cred.user);
        this._currentUser.set(userModel);
        this.persist(userModel);
        this._loading.set(false);

        this.notifications.success('Login com Google realizado com sucesso.');

        return {
          data: userModel,
          success: true,
          message: 'Login com Google realizado com sucesso.',
        } as ApiResponse<UserModel>;
      }),
      this.handleAuthError<UserModel>('Erro ao realizar login com Google.'),
    );
  }

  loginWithFacebook(): Observable<ApiResponse<UserModel>> {
    this._loading.set(true);
    const provider = new FacebookAuthProvider();

    return from(signInWithPopup(this.auth, provider)).pipe(
      map((cred) => {
        const userModel = this.mapFirebaseUserToUserModel(cred.user);
        this._currentUser.set(userModel);
        this.persist(userModel);
        this._loading.set(false);

        this.notifications.success(
          'Login com Facebook realizado com sucesso.',
        );

        return {
          data: userModel,
          success: true,
          message: 'Login com Facebook realizado com sucesso.',
        } as ApiResponse<UserModel>;
      }),
      this.handleAuthError<UserModel>('Erro ao realizar login com Facebook.'),
    );
  }

  logout(): Observable<ApiResponse<null>> {
    this._loading.set(true);

    return from(signOut(this.auth)).pipe(
      map(() => {
        this._currentUser.set(null);
        this.clearPersisted();
        this._loading.set(false);

        this.notifications.info('Você saiu do sistema.');

        return {
          data: null,
          success: true,
          message: 'Logout realizado com sucesso.',
        } as ApiResponse<null>;
      }),
      this.handleAuthError<null>('Erro ao realizar logout.'),
    );
  }

  resetPassword(email: string): Observable<ApiResponse<null>> {
    this._loading.set(true);

    return from(sendPasswordResetEmail(this.auth, email.trim())).pipe(
      map(() => {
        this._loading.set(false);
        this.notifications.success(
          'E-mail de recuperação enviado com sucesso.',
        );

        return {
          data: null,
          success: true,
          message: 'Email de recuperação enviado com sucesso.',
        } as ApiResponse<null>;
      }),
      this.handleAuthError<null>('Erro ao enviar email de recuperação de senha.'),
    );
  }

  changePassword(newPassword: string): Observable<ApiResponse<null>> {
    const user = this.auth.currentUser;
    if (!user) {
      const error = {
        code: 'AUTH/NO_USER',
        message: 'Nenhum usuário autenticado.',
      };
      return of(
        this.mapAuthErrorToApiResponse<null>(
          error,
          'Não há usuário autenticado.',
        ),
      );
    }

    this._loading.set(true);

    return from(updatePassword(user, newPassword)).pipe(
      map(() => {
        this._loading.set(false);
        this.notifications.success('Senha alterada com sucesso.');

        return {
          data: null,
          success: true,
          message: 'Senha alterada com sucesso.',
        } as ApiResponse<null>;
      }),
      this.handleAuthError<null>('Erro ao alterar senha.'),
    );
  }

  // ================= API estilo antigo (Promises booleanas) ==================

  async loginPromise(email: string, password: string): Promise<boolean> {
    try {
      await signInWithEmailAndPassword(this.auth, email.trim(), password.trim());
      return true;
    } catch (err: any) {
      console.error('login error:', err?.code, err?.message);
      return false;
    }
  }

  async registerPromise(
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> {
    try {
      const cred = await createUserWithEmailAndPassword(
        this.auth,
        email.trim(),
        password.trim(),
      );
      if (cred.user && name.trim()) {
        await (cred.user as any).updateProfile?.({ displayName: name.trim() });
      }
      return true;
    } catch (err: any) {
      console.error('register error:', err?.code, err?.message);
      return false;
    }
  }

  async loginWithGooglePromise(): Promise<boolean> {
    try {
      await signInWithPopup(this.auth, new GoogleAuthProvider());
      return true;
    } catch (err: any) {
      console.error('google login error:', err?.code, err?.message);
      return false;
    }
  }

  async loginWithFacebookPromise(): Promise<boolean> {
    try {
      await signInWithPopup(this.auth, new FacebookAuthProvider());
      return true;
    } catch (err: any) {
      console.error('facebook login error:', err?.code, err?.message);
      return false;
    }
  }

  async logoutPromise(): Promise<void> {
    await signOut(this.auth);
    this._currentUser.set(null);
    this.clearPersisted();
  }

  // ================= SUPORTE / UTILITÁRIOS ===================================

  private mapFirebaseUserToUserModel(
    user: FirebaseUser,
    displayNameOverride?: string,
  ): UserModel {
    return new UserModel({
      id: user.uid,
      email: user.email ?? '',
      displayName: displayNameOverride || user.displayName || '',
      photoUrl: user.photoURL ?? undefined,
      role: UserRole.ADMIN,
      createdAt: user.metadata.creationTime
        ? new Date(user.metadata.creationTime)
        : new Date(),
      lastLoginAt: user.metadata.lastSignInTime
        ? new Date(user.metadata.lastSignInTime)
        : new Date(),
      emailVerified: user.emailVerified,
    });
  }

  private handleAuthError<T>(defaultMessage: string) {
    return (
      source: Observable<ApiResponse<T>>,
    ): Observable<ApiResponse<T>> =>
      source.pipe(
        catchError((error: unknown) =>
          of(this.mapAuthErrorToApiResponse<T>(error, defaultMessage)),
        ),
      );
  }

  mapAuthErrorToApiResponse<T>(
    error: unknown,
    fallbackMessage: string,
  ): ApiResponse<T> {
    const friendlyMessage = mapFirebaseAuthErrorToMessage(
      error,
      fallbackMessage,
    );

    return {
      data: null as unknown as T,
      success: false,
      error: {
        code: (error as any)?.code ?? 'AUTH/ERROR',
        message: friendlyMessage,
        details: error,
      },
    };
  }

  // ===== Persistência em localStorage ========================================

  restoreFromStorage(): void {
    try {
      const raw = localStorage.getItem(AuthService.STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ReturnType<UserModel['toJSON']> & {
        emailVerified?: boolean;
      };
      const user = new UserModel({
        id: parsed.id as string,
        email: parsed.email as string,
        displayName: parsed.displayName as string,
        photoUrl: (parsed.photoUrl as string | null) ?? null,
        role: (parsed.role as UserRole) ?? UserRole.ADMIN,
        createdAt: parsed.createdAt
          ? new Date(parsed.createdAt as string)
          : new Date(),
        lastLoginAt: parsed.lastLoginAt
          ? new Date(parsed.lastLoginAt as string)
          : null,
        emailVerified: (parsed.emailVerified as boolean) ?? false,
      });
      this._currentUser.set(user);
    } catch {
      this.clearPersisted();
    }
  }

  private persist(user: UserModel): void {
    try {
      localStorage.setItem(
        AuthService.STORAGE_KEY,
        JSON.stringify(user.toJSON ? user.toJSON() : user),
      );
    } catch {
      /* ignore */
    }
  }

  private clearPersisted(): void {
    try {
      localStorage.removeItem(AuthService.STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
}
