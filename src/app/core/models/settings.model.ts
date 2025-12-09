// src/app/core/models/settings.model.ts

import { BaseEntity } from './base-entity.model';

/**
 * Propriedades para inicializar as configurações da loja / painel.
 */
export interface SettingsProps {
  id?: string;

  /** Nome da loja exibido no header, e-mails, etc. */
  storeName: string;

  /** Slug/identificador curto, ex.: 'minha-loja' */
  storeSlug?: string;

  /** Descrição curta da loja (SEO, rodapé, etc.) */
  storeDescription?: string;

  /** E-mail de contato/suporte exibido em páginas e e-mails. */
  supportEmail?: string;

  /** Telefone/WhatsApp de contato. */
  supportPhone?: string;

  /** Código de moeda padrão (BRL, USD, EUR, ...). */
  defaultCurrency?: string;

  /** Locale/idioma padrão, ex.: 'pt-BR', 'en-US'. */
  defaultLanguage?: string;

  /** URL do logo principal. */
  logoUrl?: string | null;

  /** Cores principais do tema (usadas no dashboard / vitrine). */
  primaryColor?: string;
  secondaryColor?: string;

  /** Modo de tema: light / dark / auto. */
  themeMode?: 'light' | 'dark' | 'auto';

  /**
   * Quando true, coloca o site em modo manutenção
   * (ex.: rota pública exibe tela de manutenção).
   */
  maintenanceMode?: boolean;

  /** Permite ou não checkout como convidado (sem criar conta). */
  allowGuestCheckout?: boolean;

  /** Permite criação de conta pelos usuários finais. */
  enableRegistration?: boolean;

  /** Datas padrão de auditoria. */
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

/**
 * Entidade de configurações globais da loja/painel.
 *
 * Responsável por:
 * - Guardar informações institucionais (nome, descrição, contato).
 * - Guardar preferências de tema, moeda e idioma.
 * - Guardar flags de comportamento (guest checkout, registro, manutenção).
 */
export class Settings extends BaseEntity<string> {
  private _storeName: string;
  private _storeSlug: string;
  private _storeDescription: string;

  private _supportEmail: string;
  private _supportPhone: string;

  private _defaultCurrency: string;
  private _defaultLanguage: string;

  private _logoUrl: string | null;
  private _primaryColor: string;
  private _secondaryColor: string;

  private _themeMode: 'light' | 'dark' | 'auto';
  private _maintenanceMode: boolean;
  private _allowGuestCheckout: boolean;
  private _enableRegistration: boolean;

  constructor(props: SettingsProps) {
    const id = props.id ?? 'settings-default';

    super({
      id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      deletedAt: props.deletedAt ?? null,
    });

    this._storeName = props.storeName.trim();
    this._storeSlug =
      props.storeSlug?.trim() ||
      this.slugify(props.storeName);

    this._storeDescription = props.storeDescription?.trim() ?? '';

    this._supportEmail = (props.supportEmail ?? '').trim();
    this._supportPhone = (props.supportPhone ?? '').trim();

    this._defaultCurrency = (props.defaultCurrency ?? 'BRL').toUpperCase();
    this._defaultLanguage = props.defaultLanguage ?? 'pt-BR';

    this._logoUrl = props.logoUrl ?? null;

    this._primaryColor = props.primaryColor ?? '#2563eb'; // azul padrão
    this._secondaryColor = props.secondaryColor ?? '#10b981'; // verde padrão

    this._themeMode = props.themeMode ?? 'light';
    this._maintenanceMode = props.maintenanceMode ?? false;

    this._allowGuestCheckout = props.allowGuestCheckout ?? true;
    this._enableRegistration = props.enableRegistration ?? true;
  }

  // ===== Getters =====

  get storeName(): string {
    return this._storeName;
  }

  get storeSlug(): string {
    return this._storeSlug;
  }

  get storeDescription(): string {
    return this._storeDescription;
  }

  get supportEmail(): string {
    return this._supportEmail;
  }

  get supportPhone(): string {
    return this._supportPhone;
  }

  get defaultCurrency(): string {
    return this._defaultCurrency;
  }

  get defaultLanguage(): string {
    return this._defaultLanguage;
  }

  get logoUrl(): string | null {
    return this._logoUrl;
  }

  get primaryColor(): string {
    return this._primaryColor;
  }

  get secondaryColor(): string {
    return this._secondaryColor;
  }

  get themeMode(): 'light' | 'dark' | 'auto' {
    return this._themeMode;
  }

  get maintenanceMode(): boolean {
    return this._maintenanceMode;
  }

  get isMaintenanceMode(): boolean {
    return this._maintenanceMode;
  }

  get allowGuestCheckout(): boolean {
    return this._allowGuestCheckout;
  }

  get enableRegistration(): boolean {
    return this._enableRegistration;
  }

  // ===== Regras / mutação controlada =====

  updateStoreInfo(payload: {
    storeName?: string;
    storeSlug?: string;
    storeDescription?: string;
    supportEmail?: string;
    supportPhone?: string;
  }): void {
    if (typeof payload.storeName === 'string') {
      this._storeName = payload.storeName.trim();
    }

    if (typeof payload.storeSlug === 'string') {
      this._storeSlug = payload.storeSlug.trim() || this.slugify(this._storeName);
    }

    if (typeof payload.storeDescription === 'string') {
      this._storeDescription = payload.storeDescription.trim();
    }

    if (typeof payload.supportEmail === 'string') {
      this._supportEmail = payload.supportEmail.trim();
    }

    if (typeof payload.supportPhone === 'string') {
      this._supportPhone = payload.supportPhone.trim();
    }

    this.touch();
  }

  updateBranding(payload: {
    logoUrl?: string | null;
    primaryColor?: string;
    secondaryColor?: string;
    themeMode?: 'light' | 'dark' | 'auto';
  }): void {
    if (payload.logoUrl !== undefined) {
      this._logoUrl = payload.logoUrl;
    }

    if (typeof payload.primaryColor === 'string') {
      this._primaryColor = payload.primaryColor;
    }

    if (typeof payload.secondaryColor === 'string') {
      this._secondaryColor = payload.secondaryColor;
    }

    if (payload.themeMode) {
      this._themeMode = payload.themeMode;
    }

    this.touch();
  }

  updatePreferences(payload: {
    defaultCurrency?: string;
    defaultLanguage?: string;
    allowGuestCheckout?: boolean;
    enableRegistration?: boolean;
  }): void {
    if (payload.defaultCurrency) {
      this._defaultCurrency = payload.defaultCurrency.toUpperCase();
    }

    if (payload.defaultLanguage) {
      this._defaultLanguage = payload.defaultLanguage;
    }

    if (typeof payload.allowGuestCheckout === 'boolean') {
      this._allowGuestCheckout = payload.allowGuestCheckout;
    }

    if (typeof payload.enableRegistration === 'boolean') {
      this._enableRegistration = payload.enableRegistration;
    }

    this.touch();
  }

  setMaintenanceMode(on: boolean): void {
    this._maintenanceMode = on;
    this.touch();
  }

  toggleMaintenanceMode(): void {
    this._maintenanceMode = !this._maintenanceMode;
    this.touch();
  }

  // ===== Utilitário interno =====

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // ===== Serialização =====

  override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      storeName: this._storeName,
      storeSlug: this._storeSlug,
      storeDescription: this._storeDescription,
      supportEmail: this._supportEmail,
      supportPhone: this._supportPhone,
      defaultCurrency: this._defaultCurrency,
      defaultLanguage: this._defaultLanguage,
      logoUrl: this._logoUrl,
      primaryColor: this._primaryColor,
      secondaryColor: this._secondaryColor,
      themeMode: this._themeMode,
      maintenanceMode: this._maintenanceMode,
      allowGuestCheckout: this._allowGuestCheckout,
      enableRegistration: this._enableRegistration,
    };
  }
}
