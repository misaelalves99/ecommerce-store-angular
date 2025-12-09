// src/app/core/services/notification.service.ts

import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number; // ms
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly notificationsSubject = new Subject<Notification>();

  get notifications$(): Observable<Notification> {
    return this.notificationsSubject.asObservable();
  }

  success(message: string, title = 'Sucesso', duration = 4000): void {
    this.emit('success', message, title, duration);
  }

  error(message: string, title = 'Erro', duration = 6000): void {
    this.emit('error', message, title, duration);
  }

  info(message: string, title = 'Informação', duration = 4000): void {
    this.emit('info', message, title, duration);
  }

  warning(message: string, title = 'Atenção', duration = 5000): void {
    this.emit('warning', message, title, duration);
  }

  private emit(
    type: NotificationType,
    message: string,
    title?: string,
    duration?: number,
  ): void {
    const notification: Notification = {
      id: crypto.randomUUID(),
      type,
      message,
      title,
      duration,
    };
    this.notificationsSubject.next(notification);
  }
}
