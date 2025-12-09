// src/app/core/models/store-settings.model.ts

/**
 * Configurações básicas da loja usadas na tela de "Configurações da Loja".
 * Esse modelo casa com o StoreSettingsViewModel da feature.
 */
export interface StoreSettings {
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  timezone: string;
  currency: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
}
