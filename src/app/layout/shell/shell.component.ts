// src/app/layout/shell/shell.component.ts

import { Component, HostBinding, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { LayoutService } from '../../core/services/layout.service';

@Component({
  standalone: true,
  selector: 'app-shell',
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css'],
})
export class ShellComponent {
  private readonly layoutService = inject(LayoutService);

  readonly layout = this.layoutService.layout;

  readonly isSidebarCollapsed = computed(
    () => this.layout().sidebarCollapsed ?? false,
  );

  @HostBinding('class.shell--collapsed')
  get collapsedClass(): boolean {
    return this.isSidebarCollapsed();
  }

  onToggleSidebar(): void {
    this.layoutService.toggleSidebar();
  }
}
