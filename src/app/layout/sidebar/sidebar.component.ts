// src/app/layout/sidebar/sidebar.component.ts

import { Component, Input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { LayoutService } from '../../core/services/layout.service';

// Lucide - usamos o módulo completo aqui
import { LucideAngularModule } from 'lucide-angular';

type SidebarIconName =
  | 'layout-dashboard'
  | 'shopping-bag'
  | 'users'
  | 'package'
  | 'tags'
  | 'factory'
  | 'ticket-percent'
  | 'image'
  | 'store'
  | 'user-cog'
  | 'shield-check';

interface SidebarNavItem {
  icon: SidebarIconName;
  label: string;
  route: string;
  section?: string;
}

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule, // ✅ módulo puro, sem .pick()
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  private readonly router = inject(Router);
  private readonly layoutService = inject(LayoutService);

  @Input() collapsed = false;

  /** Tema atual (usa LayoutService.layout) */
  readonly theme = computed(() => this.layoutService.layout().theme ?? 'dark');

  readonly mainItems: SidebarNavItem[] = [
    {
      icon: 'layout-dashboard',
      label: 'Dashboard',
      route: '/dashboard',
      section: 'GERAL',
    },
    {
      icon: 'shopping-bag',
      label: 'Pedidos',
      route: '/orders',
      section: 'GERAL',
    },
    {
      icon: 'users',
      label: 'Clientes',
      route: '/customers',
      section: 'GERAL',
    },
  ];

  readonly catalogItems: SidebarNavItem[] = [
    {
      icon: 'package',
      label: 'Produtos',
      route: '/catalog/products',
      section: 'CATÁLOGO',
    },
    {
      icon: 'tags',
      label: 'Categorias',
      route: '/catalog/categories',
      section: 'CATÁLOGO',
    },
    {
      icon: 'factory',
      label: 'Marcas',
      route: '/catalog/brands',
      section: 'CATÁLOGO',
    },
  ];

  readonly marketingItems: SidebarNavItem[] = [
    {
      icon: 'ticket-percent',
      label: 'Cupons',
      route: '/marketing/coupons',
      section: 'MARKETING',
    },
    {
      icon: 'image',
      label: 'Banners',
      route: '/marketing/banners',
      section: 'MARKETING',
    },
  ];

  // 🔥 Estoque removido por enquanto
  // readonly inventoryItems: SidebarNavItem[] = [ ... ];

  readonly settingsItems: SidebarNavItem[] = [
    {
      icon: 'store',
      label: 'Loja',
      route: '/settings/store',
      section: 'CONFIGURAÇÕES',
    },
    {
      icon: 'user-cog',
      label: 'Usuários',
      route: '/settings/users',
      section: 'CONFIGURAÇÕES',
    },
    {
      icon: 'shield-check',
      label: 'Perfis',
      route: '/settings/roles',
      section: 'CONFIGURAÇÕES',
    },
  ];

  isActive(route: string): boolean {
    return this.router.isActive(route, {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }
}
