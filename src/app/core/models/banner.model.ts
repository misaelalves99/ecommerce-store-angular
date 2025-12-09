// src/app/core/models/banner.model.ts

/**
 * Banner de marketing exibido em diferentes posições da loja.
 */
export interface Banner {
  id: string;

  title: string;
  subtitle?: string | null;

  /** Posição onde o banner aparece (home, categoria, checkout, etc.) */
  position: 'HOME_HERO' | 'HOME_STRIP' | 'CATEGORY_TOP' | 'CHECKOUT_SIDEBAR' | string;

  imageUrl: string;
  linkUrl: string;

  /** Indica se o banner está ativo/visível */
  isActive: boolean;

  /** Cor de fundo ou classe CSS (opcional) */
  background?: string | null;

  /** Rótulo do botão de call-to-action (opcional) */
  buttonLabel?: string | null;

  createdAt?: Date;
  updatedAt?: Date;
}
