// src/app/core/services/layout.service.ts
import { inject, Injectable, signal, computed } from '@angular/core';
import { LAYOUT_CONFIG } from '../config/layout.config';
import { LayoutToken } from '../tokens/layout.token';
import { NotificationService } from './notification.service';

export type Theme = 'light' | 'dark';

export interface LayoutState {
  theme: Theme;
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
}

// Garante que o valor inicial nunca seja "system"
const INITIAL_THEME: Theme =
  LAYOUT_CONFIG.defaultTheme === 'dark' ? 'dark' : 'light';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private readonly notifications = inject(NotificationService);

  // ===== Signals internas =====
  private readonly sidebarCollapsedSignal = signal(false);
  private readonly themeSignal = signal<Theme>(INITIAL_THEME);
  private readonly mobileSidebarOpenSignal = signal(false);

  // ===== Propriedades públicas (signals simples) =====
  readonly sidebarCollapsed = computed(() => this.sidebarCollapsedSignal());
  readonly theme = computed(() => this.themeSignal());
  readonly mobileSidebarOpen = computed(() => this.mobileSidebarOpenSignal());

  // ===== ViewModel agregado usado pelos componentes (layout().theme etc.) =====
  readonly layout = computed<LayoutState>(() => ({
    theme: this.themeSignal(),
    sidebarCollapsed: this.sidebarCollapsedSignal(),
    mobileSidebarOpen: this.mobileSidebarOpenSignal(),
  }));

  constructor() {
    this.restoreFromStorage();
  }

  // ===== Ações de layout =====

  toggleSidebar(): void {
    const collapsed = !this.sidebarCollapsedSignal();
    this.sidebarCollapsedSignal.set(collapsed);
    this.persist();
  }

  openMobileSidebar(): void {
    this.mobileSidebarOpenSignal.set(true);
  }

  closeMobileSidebar(): void {
    this.mobileSidebarOpenSignal.set(false);
  }

  toggleTheme(): void {
    const nextTheme: Theme =
      this.themeSignal() === 'light' ? 'dark' : 'light';
    this.themeSignal.set(nextTheme);
    this.applyThemeToDocument(nextTheme);
    this.persist();
    this.notifications.info(
      `Tema alterado para ${nextTheme === 'light' ? 'claro' : 'escuro'}.`,
    );
  }

  applyLayoutToken(token: LayoutToken): void {
    if (token.sidebarCollapsed !== undefined) {
      this.sidebarCollapsedSignal.set(token.sidebarCollapsed);
    }
    if (token.theme) {
      const t: Theme = token.theme === 'dark' ? 'dark' : 'light';
      this.themeSignal.set(t);
      this.applyThemeToDocument(t);
    }
    this.persist();
  }

  // ===== Persistência / tema =====

  private applyThemeToDocument(theme: Theme): void {
    const body = document.body;
    body.classList.remove('theme-light', 'theme-dark');
    body.classList.add(theme === 'light' ? 'theme-light' : 'theme-dark');
  }

  private persist(): void {
    const state = {
      sidebarCollapsed: this.sidebarCollapsedSignal(),
      theme: this.themeSignal(),
    };
    localStorage.setItem('ecommerce-layout', JSON.stringify(state));
  }

  private restoreFromStorage(): void {
    try {
      const raw = localStorage.getItem('ecommerce-layout');
      if (!raw) {
        this.applyThemeToDocument(this.themeSignal());
        return;
      }
      const state = JSON.parse(raw);
      if (typeof state.sidebarCollapsed === 'boolean') {
        this.sidebarCollapsedSignal.set(state.sidebarCollapsed);
      }
      if (state.theme === 'light' || state.theme === 'dark') {
        this.themeSignal.set(state.theme);
      }
      this.applyThemeToDocument(this.themeSignal());
    } catch {
      this.applyThemeToDocument(this.themeSignal());
    }
  }
}
