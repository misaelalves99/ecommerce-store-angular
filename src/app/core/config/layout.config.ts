// src/app/core/config/layout.config.ts
export type ThemeMode = 'light' | 'dark' | 'system';

export interface LayoutBreakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface LayoutConfig {
  appName: string;
  defaultTheme: ThemeMode;
  sidebarWidthExpanded: number;
  sidebarWidthCollapsed: number;
  headerHeight: number;
  contentMaxWidth: number | 'full';
  breakpoints: LayoutBreakpoints;
  /**
   * Quantidade máxima de itens exibidos em tabelas do dashboard
   * antes de paginar.
   */
  defaultTablePageSize: number;
}

export const LAYOUT_CONFIG: LayoutConfig = {
  appName: 'E-commerce Admin',
  defaultTheme: 'dark',
  sidebarWidthExpanded: 260,
  sidebarWidthCollapsed: 80,
  headerHeight: 64,
  contentMaxWidth: 'full',
  defaultTablePageSize: 10,
  breakpoints: {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
};
