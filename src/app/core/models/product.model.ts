// src/app/core/models/product.model.ts

import { BaseEntity } from './base-entity.model';
import { Brand } from './brand.model';
import { Category } from './category.model';
import { Price } from './price.model';
import { Stock } from './stock.model';

/**
 * Representa uma imagem de produto.
 * Pode evoluir depois para suportar diferentes resoluções, thumbnails, etc.
 */
export interface ProductImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface ProductProps {
  id: string;
  name: string;
  sku: string;
  slug?: string;
  description?: string;

  brand: Brand;
  category: Category;
  price: Price;
  stock: Stock;

  active?: boolean;
  isActive?: boolean;
  featured?: boolean;

  tags?: string[];
  images?: (ProductImage | string)[];

  weightInGrams?: number | null;
  widthInCm?: number | null;
  heightInCm?: number | null;
  lengthInCm?: number | null;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

/**
 * Entidade principal do catálogo.
 *
 * - Agrega Brand, Category, Price e Stock (OOP).
 * - Métodos para alterar preço, estoque, imagens e status.
 * - Unifica ambos os modelos de Product (com slug, imagens, tags e flags).
 */
export class Product extends BaseEntity<string> {
  private _name: string;
  private _sku: string;
  private _slug: string;
  private _description: string;

  private _brand: Brand;
  private _category: Category;
  private _price: Price;
  private _stock: Stock;

  private _active: boolean;
  private _featured: boolean;

  private _tags: string[];
  private _images: ProductImage[];

  private _weightInGrams: number | null;
  private _widthInCm: number | null;
  private _heightInCm: number | null;
  private _lengthInCm: number | null;

  constructor(props: ProductProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      deletedAt: props.deletedAt ?? null,
    });

    this._name = props.name.trim();
    this._sku = props.sku.trim();
    this._slug = (props.slug ?? this.slugify(`${props.name}-${props.sku}`)).toLowerCase();
    this._description = props.description ?? '';

    this._brand = props.brand;
    this._category = props.category;
    this._price = props.price;
    this._stock = props.stock;

    const activeFlag = props.active ?? props.isActive;
    this._active = activeFlag ?? true;
    this._featured = props.featured ?? false;

    this._tags = (props.tags ?? []).map((t) => t.trim());

    this._images = (props.images ?? []).map((img) =>
      typeof img === 'string' ? { url: img } : { ...img }
    );

    this._weightInGrams = props.weightInGrams ?? null;
    this._widthInCm = props.widthInCm ?? null;
    this._heightInCm = props.heightInCm ?? null;
    this._lengthInCm = props.lengthInCm ?? null;
  }

  // ===== Getters =====

  get name(): string {
    return this._name;
  }

  get sku(): string {
    return this._sku;
  }

  get slug(): string {
    return this._slug;
  }

  get description(): string {
    return this._description;
  }

  get brand(): Brand {
    return this._brand;
  }

  get category(): Category {
    return this._category;
  }

  get price(): Price {
    return this._price;
  }

  get stock(): Stock {
    return this._stock;
  }

  get active(): boolean {
    return this._active;
  }

  /** Alias compatível com isActive do modelo antigo */
  get isActive(): boolean {
    return this._active;
  }

  get featured(): boolean {
    return this._featured;
  }

  get tags(): string[] {
    return [...this._tags];
  }

  get images(): ProductImage[] {
    return [...this._images];
  }

  get weightInGrams(): number | null {
    return this._weightInGrams;
  }

  get widthInCm(): number | null {
    return this._widthInCm;
  }

  get heightInCm(): number | null {
    return this._heightInCm;
  }

  get lengthInCm(): number | null {
    return this._lengthInCm;
  }

  // ===== Mutação controlada =====

  set name(value: string) {
    const trimmed = value.trim();
    if (trimmed && trimmed !== this._name) {
      this._name = trimmed;
      this._slug = this.slugify(`${this._name}-${this._sku}`);
      this.touch();
    }
  }

  set description(value: string) {
    this._description = value ?? '';
    this.touch();
  }

  set brand(value: Brand) {
    this._brand = value;
    this.touch();
  }

  set category(value: Category) {
    this._category = value;
    this.touch();
  }

  set weightInGrams(value: number | null) {
    this._weightInGrams = value;
    this.touch();
  }

  set widthInCm(value: number | null) {
    this._widthInCm = value;
    this.touch();
  }

  set heightInCm(value: number | null) {
    this._heightInCm = value;
    this.touch();
  }

  set lengthInCm(value: number | null) {
    this._lengthInCm = value;
    this.touch();
  }

  // --- Status / destaque ---

  activate(): void {
    if (!this._active) {
      this._active = true;
      this.touch();
    }
  }

  deactivate(): void {
    if (this._active) {
      this._active = false;
      this.touch();
    }
  }

  /** Alias compatível com setActive do segundo modelo */
  setActive(active: boolean): void {
    if (this._active !== active) {
      this._active = active;
      this.touch();
    }
  }

  markAsFeatured(): void {
    if (!this._featured) {
      this._featured = true;
      this.touch();
    }
  }

  unmarkAsFeatured(): void {
    if (this._featured) {
      this._featured = false;
      this.touch();
    }
  }

  // --- Preço / estoque ---

  /**
   * Troca o objeto de preço por outro (por ex. após aplicar reajuste).
   * Toda a lógica de descontos/parcelas fica encapsulada em Price.
   */
  changePrice(price: Price): void {
    this._price = price;
    this.touch();
  }

  /** Alias compatível com updatePrice do segundo modelo */
  updatePrice(price: Price): void {
    this.changePrice(price);
  }

  /**
   * Atualiza a referência de estoque (ajustes internos ficam em Stock).
   */
  changeStock(stock: Stock): void {
    this._stock = stock;
    this.touch();
  }

  /** Alias compatível com updateStock do segundo modelo */
  updateStock(stock: Stock): void {
    this.changeStock(stock);
  }

  isInStock(minQuantity = 1): boolean {
    return this._stock.availableQuantity >= minQuantity;
  }

  /**
   * Regras para remoção (pode evoluir para checar pedidos associados).
   */
  canBeDeleted(): boolean {
    return !this._active;
  }

  // --- Tags ---

  addTag(tag: string): void {
    const normalized = tag.trim();
    if (normalized && !this._tags.includes(normalized)) {
      this._tags.push(normalized);
      this.touch();
    }
  }

  removeTag(tag: string): void {
    const index = this._tags.indexOf(tag);
    if (index !== -1) {
      this._tags.splice(index, 1);
      this.touch();
    }
  }

  setTags(tags: string[]): void {
    this._tags = tags.map((t) => t.trim());
    this.touch();
  }

  // --- Imagens ---

  addImage(image: ProductImage): void {
    const normalized: ProductImage = { ...image };
    if (normalized.isPrimary) {
      // garante apenas 1 imagem principal
      this._images = this._images.map((img) => ({ ...img, isPrimary: false }));
    }
    this._images.push(normalized);
    this.touch();
  }

  /** Compatível com addImage(url: string) do modelo antigo */
  addImageUrl(url: string): void {
    this.addImage({ url });
  }

  removeImage(url: string): void {
    const lengthBefore = this._images.length;
    this._images = this._images.filter((img) => img.url !== url);
    if (this._images.length !== lengthBefore) {
      this.touch();
    }
  }

  // --- Atualização de detalhes (estilo do segundo modelo) ---

  updateDetails(params: {
    name?: string;
    description?: string;
    tags?: string[];
  }): void {
    if (params.name && params.name.trim() !== this._name) {
      this.name = params.name;
    }

    if (typeof params.description !== 'undefined') {
      this.description = params.description ?? '';
    }

    if (params.tags) {
      this.setTags(params.tags);
    }
  }

  // ===== Utilitários internos =====

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
      sku: this._sku,
      slug: this._slug,
      description: this._description,
      active: this._active,
      isActive: this._active,
      featured: this._featured,
      tags: this._tags,
      images: this._images,
      brand: this._brand.toJSON(),
      category: this._category.toJSON(),
      price: this._price.toJSON ? this._price.toJSON() : this._price,
      stock: this._stock.toJSON ? this._stock.toJSON() : this._stock,
      weightInGrams: this._weightInGrams,
      widthInCm: this._widthInCm,
      heightInCm: this._heightInCm,
      lengthInCm: this._lengthInCm,
    };
  }
}
