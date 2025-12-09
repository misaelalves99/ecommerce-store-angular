// src/app/core/models/category.model.ts

import { BaseEntity } from './base-entity.model';

export interface CategoryProps {
  id?: string;
  name: string;
  slug?: string;
  description?: string | null;
  icon?: string | null;          // ex: nome do ícone ou caminho
  parentId?: string | null;      // hierarquia (categoria pai)
  displayOrder?: number;         // ordenação no menu / listagens
  active?: boolean;              // status principal
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

/**
 * Categoria do catálogo (Eletrônicos, Moda, Acessórios, etc.).
 *
 * - Suporta hierarquia (parentId) para subcategorias.
 * - Campo displayOrder controla ordenação no menu do dashboard/loja.
 */
export class Category extends BaseEntity<string> {
  private _name: string;
  private _slug: string;
  private _description: string | null;
  private _icon: string | null;
  private _parentId: string | null;
  private _displayOrder: number;
  private _active: boolean;

  constructor(props: CategoryProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      deletedAt: props.deletedAt ?? null,
    });

    this._name = props.name.trim();
    this._slug = (props.slug ?? this.slugify(props.name)).toLowerCase();
    this._description = props.description ?? null;
    this._icon = props.icon ?? null;
    this._parentId = props.parentId ?? null;
    this._displayOrder = props.displayOrder ?? 0;
    this._active = props.active ?? true;
  }

  // ===== Getters =====

  get name(): string {
    return this._name;
  }

  get slug(): string {
    return this._slug;
  }

  get description(): string | null {
    return this._description;
  }

  get icon(): string | null {
    return this._icon;
  }

  get parentId(): string | null {
    return this._parentId;
  }

  /** Ordenação em menus/listas (equivalente a position) */
  get displayOrder(): number {
    return this._displayOrder;
  }

  /** Alias de leitura para compatibilidade c/ position */
  get position(): number {
    return this._displayOrder;
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

  set description(value: string | null) {
    this._description = value ?? null;
    this.touch();
  }

  set icon(value: string | null) {
    this._icon = value;
    this.touch();
  }

  set parentId(value: string | null) {
    this._parentId = value;
    this.touch();
  }

  set displayOrder(value: number) {
    this._displayOrder = value;
    this.touch();
  }

  /** Atualização em batch dos principais campos textuais */
  updateInfo(params: {
    name?: string;
    description?: string | null;
    icon?: string | null;
    parentId?: string | null;
    displayOrder?: number;
  }): void {
    let changed = false;

    if (params.name && params.name.trim() !== this._name) {
      const trimmed = params.name.trim();
      this._name = trimmed;
      this._slug = this.slugify(trimmed);
      changed = true;
    }

    if (typeof params.description !== 'undefined') {
      this._description = params.description ?? null;
      changed = true;
    }

    if (typeof params.icon !== 'undefined') {
      this._icon = params.icon ?? null;
      changed = true;
    }

    if (typeof params.parentId !== 'undefined') {
      this._parentId = params.parentId ?? null;
      changed = true;
    }

    if (typeof params.displayOrder === 'number') {
      this._displayOrder = params.displayOrder;
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

  hasParent(): boolean {
    return !!this._parentId;
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
      icon: this._icon,
      parentId: this._parentId,
      displayOrder: this._displayOrder,
      position: this._displayOrder, // alias
      active: this._active,
      isActive: this._active,       // alias
    };
  }
}
