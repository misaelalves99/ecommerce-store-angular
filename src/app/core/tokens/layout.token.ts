// src/app/core/tokens/layout.token.ts

/**
 * Token de layout usado para persistir preferências do usuário
 * (tema, sidebar, etc.) e aplicar no LayoutService.
 */

export type LayoutTheme = 'light' | 'dark';

export interface LayoutToken {
  theme?: LayoutTheme;
  sidebarCollapsed?: boolean;
}

export const DEFAULT_LAYOUT_TOKEN: LayoutToken = {
  theme: 'dark',
  sidebarCollapsed: false,
};
