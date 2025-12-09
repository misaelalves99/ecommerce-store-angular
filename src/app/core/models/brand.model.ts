// src/app/core/models/brand.model.ts

import { BaseEntity } from './base-entity.model';

export interface BrandProps {
  id?: string;
  name: string;
  slug?: string;
  description?: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

/**
 * Marca de produtos do catálogo (Nike, Apple, Samsung, etc.).
 *
 * - Centraliza metadados de marca para exibição no dashboard e filtros.
 * - Mantém status ativo/inativo para controlar o que aparece nas telas.
 */
export class Brand extends BaseEntity<string> {
  private _name: string;
  private _slug: string;
  private _description: string;
  private _logoUrl: string | null;
  private _websiteUrl: string | null;
  private _active: boolean;

  constructor(props: BrandProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      deletedAt: props.deletedAt ?? null,
    });

    this._name = props.name.trim();
    this._slug = (props.slug ?? this.slugify(props.name)).toLowerCase();
    this._description = props.description ?? '';
    this._logoUrl = props.logoUrl ?? null;
    this._websiteUrl = props.websiteUrl ?? null;
    this._active = props.active ?? true;
  }

  // ===== Getters =====

  get name(): string {
    return this._name;
  }

  get slug(): string {
    return this._slug;
  }

  get description(): string {
    return this._description;
  }

  get logoUrl(): string | null {
    return this._logoUrl;
  }

  get websiteUrl(): string | null {
    return this._websiteUrl;
  }

  /** Status principal */
  get active(): boolean {
    return this._active;
  }

  /** Alias de leitura para compatibilidade: isActive */
  get isActive(): boolean {
    return this._active;
  }

  // ===== Regras de domínio / mutação controlada =====

  set name(value: string) {
    const trimmed = value.trim();
    if (trimmed && trimmed !== this._name) {
      this._name = trimmed;
      this._slug = this.slugify(trimmed);
      this.touch();
    }
  }

  set description(value: string) {
    this._description = value ?? '';
    this.touch();
  }

  set logoUrl(value: string | null) {
    this._logoUrl = value;
    this.touch();
  }

  set websiteUrl(value: string | null) {
    this._websiteUrl = value;
    this.touch();
  }

  /**
   * Atalho p/ atualizar vários campos de uma vez.
   */
  updateInfo(params: {
    name?: string;
    description?: string;
    logoUrl?: string | null;
    websiteUrl?: string | null;
  }): void {
    let changed = false;

    if (params.name && params.name.trim() !== this._name) {
      const trimmed = params.name.trim();
      this._name = trimmed;
      this._slug = this.slugify(trimmed);
      changed = true;
    }

    if (typeof params.description !== 'undefined') {
      this._description = params.description ?? '';
      changed = true;
    }

    if (typeof params.logoUrl !== 'undefined') {
      this._logoUrl = params.logoUrl ?? null;
      changed = true;
    }

    if (typeof params.websiteUrl !== 'undefined') {
      this._websiteUrl = params.websiteUrl ?? null;
      changed = true;
    }

    if (changed) {
      this.touch();
    }
  }

  setActive(active: boolean): void {
    if (this._active !== active) {
      this._active = active;
      this.touch();
    }
  }

  activate(): void {
    this.setActive(true);
  }

  deactivate(): void {
    this.setActive(false);
  }

  private slugify(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      name: this._name,
      slug: this._slug,
      description: this._description,
      logoUrl: this._logoUrl,
      websiteUrl: this._websiteUrl,
      active: this._active,
      isActive: this._active, // alias para compatibilidade
    };
  }
}
