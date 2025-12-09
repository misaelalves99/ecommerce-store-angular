// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ToastContainerComponent } from './shared/components/feedback/toast-container/toast-container.component';

/**
 * Componente raiz da aplicação.
 *
 * Aqui deixamos apenas:
 * - <router-outlet> para renderizar o Shell + páginas
 * - <app-toast-container> para feedback global (toasts)
 *
 * Todo o layout de dashboard (sidebar, header, etc.)
 * fica no ShellComponent em `layout/shell`.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ecommerce-store-angular-admin';
}
