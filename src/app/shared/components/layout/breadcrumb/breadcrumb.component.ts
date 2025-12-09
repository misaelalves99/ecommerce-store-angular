// src/app/shared/components/layout/breadcrumb/breadcrumb.component.ts

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  routerLink?: string | any[];
  disabled?: boolean;
}

@Component({
  standalone: true,
  selector: 'app-breadcrumb',
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
}
