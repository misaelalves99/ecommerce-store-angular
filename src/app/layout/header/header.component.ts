// src/app/layout/header/header.component.ts

import { Component, EventEmitter, Output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { LayoutService } from '../../core/services/layout.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly layoutService = inject(LayoutService);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);

  @Output() toggleSidebar = new EventEmitter<void>();

  /** Signal vindo do LayoutService */
  readonly layout = this.layoutService.layout;

  readonly isDarkTheme = computed(() => this.layout().theme === 'dark');

  get userDisplayName(): string {
    // currentUser é um Signal<User | null>, então precisamos chamar como função
    const user = this.authService.currentUser();
    if (!user) return 'Convidado';
    return user.displayName || user.email || 'Usuário';
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  onToggleTheme(): void {
    this.layoutService.toggleTheme();
  }

  async onLogout(): Promise<void> {
    try {
      await this.authService.logout();
      this.notifications.success('Você saiu da aplicação.');
      await this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error(error);
      this.notifications.error('Não foi possível realizar logout. Tente novamente.');
    }
  }
}
