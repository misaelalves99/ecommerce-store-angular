// src/app/core/services/auth.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Auth } from '@angular/fire/auth';
import { NotificationService } from './notification.service';

describe('AuthService', () => {
  let service: AuthService;

  const authMock: Partial<Auth> = {
    // se precisar, adicionamos métodos mockados aqui depois
  };

  const notificationMock: Partial<NotificationService> = {
    success: jasmine.createSpy('success'),
    info: jasmine.createSpy('info'),
    error: jasmine.createSpy('error'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Auth, useValue: authMock },
        { provide: NotificationService, useValue: notificationMock },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });
});
