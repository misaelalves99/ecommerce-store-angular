// src/app/layout/page-header/page-header.component.ts

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, computed } from '@angular/core';

import {
  BreadcrumbComponent,
  BreadcrumbItem,
} from '../../shared/components/layout/breadcrumb/breadcrumb.component';
import {
  ButtonComponent,
  ButtonVariant,
} from '../../shared/components/ui/button/button.component';

export type PageHeaderBreadcrumbItem =
  | string
  | {
      label: string;
      routerLink?: string | any[];
      link?: string | any[]; // compatibilidade com 'link'
      disabled?: boolean;
      active?: boolean;
    };

export interface PageHeaderAction {
  label: string;
  variant?: ButtonVariant;
  type?: 'button' | 'submit' | 'reset';
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
}

@Component({
  standalone: true,
  selector: 'app-page-header',
  imports: [CommonModule, BreadcrumbComponent, ButtonComponent],
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css'],
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle?: string;

  @Input() breadcrumb: PageHeaderBreadcrumbItem[] = [];
  @Input() actions: PageHeaderAction[] = [];

  @Output() actionClick = new EventEmitter<PageHeaderAction>();

  readonly breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    return (this.breadcrumb ?? []).map((item) => {
      if (typeof item === 'string') {
        return { label: item };
      }

      const link = item.routerLink ?? item.link;

      return {
        label: item.label,
        routerLink: link,
        disabled:
          item.disabled ??
          // se vier "active: false", interpretamos como desabilitado
          (item.active === false ? true : false),
      };
    });
  });

  onActionClick(action: PageHeaderAction): void {
    if (action.disabled || action.loading) return;
    this.actionClick.emit(action);
  }
}
