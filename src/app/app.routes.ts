// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { roleGuard } from './core/guards/role.guard';
import { ShellComponent } from './layout/shell/shell.component';

export const appRoutes: Routes = [
  // ================== AUTH ==================
  {
    path: 'auth',
    canActivateChild: [guestGuard],
    children: [
      {
        path: 'login',
        title: 'Login | E-commerce Admin',
        loadComponent: () =>
          import('./features/auth/pages/login-page/login-page.component').then(
            (c) => c.LoginPageComponent,
          ),
      },
      {
        path: 'register',
        title: 'Criar conta | E-commerce Admin',
        loadComponent: () =>
          import(
            './features/auth/pages/register-page/register-page.component'
          ).then((c) => c.RegisterPageComponent),
      },
      {
        path: 'forgot-password',
        title: 'Recuperar senha | E-commerce Admin',
        loadComponent: () =>
          import(
            './features/auth/pages/forgot-password-page/forgot-password-page.component'
          ).then((c) => c.ForgotPasswordPageComponent),
      },
      {
        path: 'reset-password',
        title: 'Redefinir senha | E-commerce Admin',
        loadComponent: () =>
          import(
            './features/auth/pages/reset-password-page/reset-password-page.component'
          ).then((c) => c.ResetPasswordPageComponent),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
    ],
  },

  // ================== AREA LOGADA (SHELL) ==================
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },

      // -------- DASHBOARD --------
      {
        path: 'dashboard',
        title: 'Dashboard | E-commerce Admin',
        loadComponent: () =>
          import(
            './features/dashboard/pages/dashboard-page/dashboard-page.component'
          ).then((c) => c.DashboardPageComponent),
        data: {
          breadcrumb: 'Dashboard',
          icon: 'lucide:layout-dashboard',
        },
      },

      // ================== CATALOG → PRODUCTS ==================
      {
        path: 'catalog/products',
        children: [
          {
            path: '',
            title: 'Produtos | Catálogo',
            loadComponent: () =>
              import(
                './features/catalog/products/pages/products-list-page/products-list-page.component'
              ).then((c) => c.ProductsListPageComponent),
            data: {
              breadcrumb: 'Produtos',
            },
          },
          {
            path: 'create',
            title: 'Novo produto | Catálogo',
            loadComponent: () =>
              import(
                './features/catalog/products/pages/products-create-page/products-create-page.component'
              ).then((c) => c.ProductsCreatePageComponent),
            data: {
              breadcrumb: 'Novo produto',
            },
          },
          {
            path: 'edit/:id',
            title: 'Editar produto | Catálogo',
            loadComponent: () =>
              import(
                './features/catalog/products/pages/products-edit-page/products-edit-page.component'
              ).then((c) => c.ProductsEditPageComponent),
            data: {
              breadcrumb: 'Editar produto',
            },
          },
          {
            path: 'details/:id',
            title: 'Detalhes do produto | Catálogo',
            loadComponent: () =>
              import(
                './features/catalog/products/pages/products-details-page/products-details-page.component'
              ).then((c) => c.ProductsDetailsPageComponent),
            data: {
              breadcrumb: 'Detalhes do produto',
            },
          },
          {
            path: 'delete/:id',
            title: 'Remover produto | Catálogo',
            loadComponent: () =>
              import(
                './features/catalog/products/pages/products-delete-page/products-delete-page.component'
              ).then((c) => c.ProductsDeletePageComponent),
            data: {
              breadcrumb: 'Remover produto',
            },
          },
        ],
      },

      // ================== CATALOG → CATEGORIES ==================
      {
        path: 'catalog/categories',
        children: [
          {
            path: '',
            title: 'Categorias | Catálogo',
            loadComponent: () =>
              import(
                './features/catalog/categories/pages/categories-list-page/categories-list-page.component'
              ).then((c) => c.CategoriesListPageComponent),
            data: {
              breadcrumb: 'Categorias',
            },
          },
          {
            path: 'create',
            title: 'Nova categoria | Catálogo',
            loadComponent: () =>
              import(
                './features/catalog/categories/pages/categories-create-page/categories-create-page.component'
              ).then((c) => c.CategoriesCreatePageComponent),
            data: {
              breadcrumb: 'Nova categoria',
            },
          },
          {
            path: 'edit/:id',
            title: 'Editar categoria | Catálogo',
            loadComponent: () =>
              import(
                './features/catalog/categories/pages/categories-edit-page/categories-edit-page.component'
              ).then((c) => c.CategoriesEditPageComponent),
            data: {
              breadcrumb: 'Editar categoria',
            },
          },
          {
            path: 'details/:id',
            title: 'Detalhes da categoria | Catálogo',
            loadComponent: () =>
              import(
                './features/catalog/categories/pages/categories-details-page/categories-details-page.component'
              ).then((c) => c.CategoriesDetailsPageComponent),
            data: {
              breadcrumb: 'Detalhes da categoria',
            },
          },
          {
            path: 'delete/:id',
            title: 'Remover categoria | Catálogo',
            loadComponent: () =>
              import(
                './features/catalog/categories/pages/categories-delete-page/categories-delete-page.component'
              ).then((c) => c.CategoriesDeletePageComponent),
            data: {
              breadcrumb: 'Remover categoria',
            },
          },
        ],
      },

      // ================== CATALOG → BRANDS ==================
      {
        path: 'catalog/brands',
        children: [
          {
            path: '',
            title: 'Marcas | Catálogo',
            loadComponent: () =>
              import(
                './features/catalog/brands/pages/brands-list-page/brands-list-page.component'
              ).then((c) => c.BrandsListPageComponent),
            data: {
              breadcrumb: 'Marcas',
            },
          },
          {
            path: 'create',
            title: 'Nova marca | Catálogo',
            loadComponent: () =>
              import(
                './features/catalog/brands/pages/brands-create-page/brands-create-page.component'
              ).then((c) => c.BrandsCreatePageComponent),
            data: {
              breadcrumb: 'Nova marca',
            },
          },
          {
            path: 'edit/:id',
            title: 'Editar marca | Catálogo',
            loadComponent: () =>
              import(
                './features/catalog/brands/pages/brands-edit-page/brands-edit-page.component'
              ).then((c) => c.BrandsEditPageComponent),
            data: {
              breadcrumb: 'Editar marca',
            },
          },
          {
            path: 'details/:id',
            title: 'Detalhes da marca | Catálogo',
            loadComponent: () =>
              import(
                './features/catalog/brands/pages/brands-details-page/brands-details-page.component'
              ).then((c) => c.BrandsDetailsPageComponent),
            data: {
              breadcrumb: 'Detalhes da marca',
            },
          },
          {
            path: 'delete/:id',
            title: 'Remover marca | Catálogo',
            loadComponent: () =>
              import(
                './features/catalog/brands/pages/brands-delete-page/brands-delete-page.component'
              ).then((c) => c.BrandsDeletePageComponent),
            data: {
              breadcrumb: 'Remover marca',
            },
          },
        ],
      },

      // ================== ORDERS ==================
      {
        path: 'orders',
        children: [
          {
            path: '',
            title: 'Pedidos | E-commerce Admin',
            loadComponent: () =>
              import(
                './features/orders/pages/orders-list-page/orders-list-page.component'
              ).then((c) => c.OrdersListPageComponent),
            data: {
              breadcrumb: 'Pedidos',
            },
          },
          {
            path: 'details/:id',
            title: 'Detalhes do pedido | E-commerce Admin',
            loadComponent: () =>
              import(
                './features/orders/pages/orders-details-page/orders-details-page.component'
              ).then((c) => c.OrdersDetailsPageComponent),

            data: {
              breadcrumb: 'Detalhes do pedido',
            },
          },
          {
            path: 'timeline/:id',
            title: 'Linha do tempo do pedido | E-commerce Admin',
            loadComponent: () =>
              import(
                './features/orders/pages/orders-timeline-page/orders-timeline-page.component'
              ).then((c) => c.OrdersTimelinePageComponent), // ou OrderTimelinePageComponent
            data: {
              breadcrumb: 'Linha do tempo',
            },
          },
        ],
      },

      // ================== CUSTOMERS ==================
      {
        path: 'customers',
        children: [
          {
            path: '',
            title: 'Clientes | E-commerce Admin',
            loadComponent: () =>
              import(
                './features/customers/pages/customers-list-page/customers-list-page.component'
              ).then((c) => c.CustomersListPageComponent),
            data: {
              breadcrumb: 'Clientes',
            },
          },
          {
            path: 'create',
            title: 'Novo cliente | E-commerce Admin',
            loadComponent: () =>
              import(
                './features/customers/pages/customers-create-page/customers-create-page.component'
              ).then((c) => c.CustomersCreatePageComponent),
            data: {
              breadcrumb: 'Novo cliente',
            },
          },
          {
            path: 'edit/:id',
            title: 'Editar cliente | E-commerce Admin',
            loadComponent: () =>
              import(
                './features/customers/pages/customers-edit-page/customers-edit-page.component'
              ).then((c) => c.CustomersEditPageComponent),
            data: {
              breadcrumb: 'Editar cliente',
            },
          },
          {
            path: 'details/:id',
            title: 'Detalhes do cliente | E-commerce Admin',
            loadComponent: () =>
              import(
                './features/customers/pages/customers-details-page/customers-details-page.component'
              ).then((c) => c.CustomersDetailsPageComponent),
            data: {
              breadcrumb: 'Detalhes do cliente',
            },
          },
          {
            path: 'delete/:id',
            title: 'Remover cliente | E-commerce Admin',
            loadComponent: () =>
              import(
                './features/customers/pages/customers-delete-page/customers-delete-page.component'
              ).then((c) => c.CustomersDeletePageComponent),
            data: {
              breadcrumb: 'Remover cliente',
            },
          },
        ],
      },

      // ================== MARKETING → COUPONS ==================

      {
        path: 'marketing/coupons',
        children: [
          {
            path: '',
            title: 'Cupons | Marketing',
            loadComponent: () =>
              import(
                './features/marketing/coupons/pages/coupons-list-page/coupons-list-page.component'
              ).then((c) => c.CouponsListPageComponent),
            data: {
              breadcrumb: 'Cupons',
            },
          },
          {
            path: 'create',
            title: 'Novo cupom | Marketing',
            loadComponent: () =>
              import(
                './features/marketing/coupons/pages/coupons-create-page/coupons-create-page.component'
              ).then((c) => c.CouponsCreatePageComponent),
            data: {
              breadcrumb: 'Novo cupom',
            },
          },
          {
            path: 'edit/:id',
            title: 'Editar cupom | Marketing',
            loadComponent: () =>
              import(
                './features/marketing/coupons/pages/coupons-edit-page/coupons-edit-page.component'
              ).then((c) => c.CouponsEditPageComponent),
            data: {
              breadcrumb: 'Editar cupom',
            },
          },
          {
            path: 'details/:id',
            title: 'Detalhes do cupom | Marketing',
            loadComponent: () =>
              import(
                './features/marketing/coupons/pages/coupons-details-page/coupons-details-page.component'
              ).then((c) => c.CouponsDetailsPageComponent),
            data: {
              breadcrumb: 'Detalhes do cupom',
            },
          },
          {
            path: 'delete/:id',
            title: 'Remover cupom | Marketing',
            loadComponent: () =>
              import(
                './features/marketing/coupons/pages/coupons-delete-page/coupons-delete-page.component'
              ).then((c) => c.CouponsDeletePageComponent),
            data: {
              breadcrumb: 'Remover cupom',
            },
          },
        ],
      },

      // ================== MARKETING → BANNERS ==================
      {
        path: 'marketing/banners',
        children: [
          {
            path: '',
            title: 'Banners | Marketing',
            loadComponent: () =>
              import(
                './features/marketing/banners/pages/banners-page/banners-page.component'
              ).then((c) => c.BannersPageComponent),
            data: {
              breadcrumb: 'Banners',
            },
          },
        ],
      },

      // ================== INVENTORY ==================
      {
        path: 'inventory',
        children: [
          {
            path: '',
            title: 'Estoque | E-commerce Admin',
            loadComponent: () =>
              import(
                './features/inventory/pages/stock-dashboard-page/stock-dashboard-page.component'
              ).then((c) => c.StockDashboardPageComponent),
            data: {
              breadcrumb: 'Estoque',
            },
          },
          {
            path: 'adjustment',
            title: 'Ajustes de estoque | E-commerce Admin',
            loadComponent: () =>
              import(
                './features/inventory/pages/stock-adjustment-page/stock-adjustment-page.component'
              ).then((c) => c.StockAdjustmentPageComponent),
            data: {
              breadcrumb: 'Ajustes de estoque',
            },
          },
        ],
      },

      // ================== SETTINGS ==================
      {
        path: 'settings',
        canActivateChild: [roleGuard],
        children: [
          {
            path: 'store',
            title: 'Configurações da loja | E-commerce Admin',
            loadComponent: () =>
              import(
                './features/settings/pages/settings-store-page/settings-store-page.component'
              ).then((c) => c.SettingsStorePageComponent),
            data: {
              breadcrumb: 'Configurações da loja',
            },
          },
          {
            path: 'users',
            title: 'Usuários do painel | E-commerce Admin',
            loadComponent: () =>
              import(
                './features/settings/pages/settings-users-page/settings-users-page.component'
              ).then((c) => c.SettingsUsersPageComponent),
            data: {
              breadcrumb: 'Usuários do painel',
            },
          },
          {
            path: 'roles',
            title: 'Perfis e permissões | E-commerce Admin',
            loadComponent: () =>
              import(
                './features/settings/pages/settings-roles-page/settings-roles-page.component'
              ).then((c) => c.SettingsRolesPageComponent),
            data: {
              breadcrumb: 'Perfis e permissões',
            },
          },
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'store',
          },
        ],
      },
    ],
  },

  // Fallback
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
