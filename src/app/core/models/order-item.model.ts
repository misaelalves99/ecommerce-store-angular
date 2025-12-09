// src/app/core/models/order-item.model.ts

import { BaseEntity } from './base-entity.model';
import { Price } from './price.model';

export interface OrderItemProps {
  id: string;
  productId: string;
  productName: string;
  sku?: string | null;
  imageUrl?: string | null;

  // Quantidade
  quantity: number;

  // Snapshot de preço
  price?: Price;             // VO de preço (quando existir)
  unitPrice?: number;        // preço unitário bruto
  discountPerUnit?: number;  // desconto por unidade

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

/**
 * Item de pedido (snapshot de produto + preço).
 *
 * - Não depende diretamente de Product para evitar acoplamento forte.
 * - Guarda snapshot de nome, SKU, imagem e preço no momento da venda.
 * - Suporta tanto VO Price quanto preço numérico (unitPrice + discountPerUnit).
 */
export class OrderItem extends BaseEntity<string> {
  private _productId: string;
  private _productName: string;
  private _sku: string | null;
  private _imageUrl: string | null;

  private _quantity: number;

  private _unitPrice: number;
  private _discountPerUnit: number;

  /** Snapshot opcional com VO de preço */
  private _priceSnapshot: Price | null;

  constructor(props: OrderItemProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      deletedAt: props.deletedAt ?? null,
    });

    this._productId = props.productId;
    this._productName = props.productName.trim();
    this._sku = props.sku?.trim() ?? null;
    this._imageUrl = props.imageUrl?.trim() ?? null;

    this._quantity = OrderItem.ensurePositiveQuantity(props.quantity);

    this._priceSnapshot = props.price ?? null;

    if (this._priceSnapshot) {
      // Se VO Price existe, usamos o valor final como unitPrice
      this._unitPrice = OrderItem.ensureNonNegativeNumber(this._priceSnapshot.finalAmount);
    } else {
      this._unitPrice = OrderItem.ensureNonNegativeNumber(props.unitPrice ?? 0);
    }

    this._discountPerUnit = OrderItem.ensureNonNegativeNumber(props.discountPerUnit ?? 0);
  }

  // ===== Getters =====

  get productId(): string {
    return this._productId;
  }

  get productName(): string {
    return this._productName;
  }

  get sku(): string | null {
    return this._sku;
  }

  get imageUrl(): string | null {
    return this._imageUrl;
  }

  get quantity(): number {
    return this._quantity;
  }

  /** Snapshot VO Price (se existir) */
  get price(): Price | null {
    return this._priceSnapshot;
  }

  /** Preço unitário bruto (sem desconto por unidade) */
  get unitPrice(): number {
    return this._unitPrice;
  }

  /** Desconto por unidade (numérico) */
  get discountPerUnit(): number {
    return this._discountPerUnit;
  }

  /** Preço unitário final (unitPrice - discountPerUnit, nunca negativo) */
  get finalUnitPrice(): number {
    const value = this._unitPrice - this._discountPerUnit;
    return value < 0 ? 0 : value;
  }

  /** Subtotal bruto (sem desconto por unidade) */
  get subtotalWithoutDiscount(): number {
    return this._unitPrice * this._quantity;
  }

  /** Total de desconto do item (discountPerUnit * quantity) */
  get totalDiscount(): number {
    return this._discountPerUnit * this._quantity;
  }

  /**
   * Valor total do item.
   * (subtotalWithoutDiscount - totalDiscount), clampado em 0.
   */
  get total(): number {
    const total = this.subtotalWithoutDiscount - this.totalDiscount;
    return total < 0 ? 0 : total;
  }

  // ===== Regras de domínio =====

  private static ensurePositiveQuantity(value: number): number {
    const safe = Math.floor(value);
    if (safe <= 0) {
      throw new Error('Quantidade do item deve ser maior que zero.');
    }
    return safe;
  }

  private static ensureNonNegativeNumber(value: number): number {
    if (value < 0) {
      throw new Error('Valor não pode ser negativo.');
    }
    return Math.round(value * 100) / 100;
  }

  // --- Quantidade ---

  changeQuantity(quantity: number): void {
    this._quantity = OrderItem.ensurePositiveQuantity(quantity);
    this.touch();
  }

  increaseQuantity(by: number = 1): void {
    const safe = OrderItem.ensurePositiveQuantity(by);
    this._quantity += safe;
    this.touch();
  }

  decreaseQuantity(by: number = 1): void {
    const safe = OrderItem.ensurePositiveQuantity(by);
    const newQuantity = this._quantity - safe;
    if (newQuantity <= 0) {
      throw new Error('Quantidade do item não pode ficar menor que 1.');
    }
    this._quantity = newQuantity;
    this.touch();
  }

  /** Alias para compatibilidade com modelo anterior */
  setQuantity(quantity: number): void {
    this.changeQuantity(quantity);
  }

  /** Alias para compatibilidade com modelo anterior */
  increment(quantity = 1): void {
    this.increaseQuantity(quantity);
  }

  /** Alias para compatibilidade com modelo anterior */
  decrement(quantity = 1): void {
    this.decreaseQuantity(quantity);
  }

  // --- Preço / desconto ---

  setUnitPrice(price: number): void {
    this._unitPrice = OrderItem.ensureNonNegativeNumber(price);
    this.touch();
  }

  setDiscountPerUnit(discount: number): void {
    this._discountPerUnit = OrderItem.ensureNonNegativeNumber(discount);
    this.touch();
  }

  updatePriceSnapshot(price: Price | null): void {
    this._priceSnapshot = price;
    if (price) {
      this._unitPrice = OrderItem.ensureNonNegativeNumber(price.finalAmount);
    }
    this.touch();
  }

  // --- Snapshot de dados do produto ---

  setSnapshotName(name: string): void {
    this._productName = name.trim();
    this.touch();
  }

  setSnapshotSku(sku: string | null): void {
    this._sku = sku?.trim() ?? null;
    this.touch();
  }

  setImageUrl(url: string | null): void {
    this._imageUrl = url?.trim() ?? null;
    this.touch();
  }

  override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      productId: this._productId,
      productName: this._productName,
      sku: this._sku,
      imageUrl: this._imageUrl,
      quantity: this._quantity,
      unitPrice: this._unitPrice,
      discountPerUnit: this._discountPerUnit,
      finalUnitPrice: this.finalUnitPrice,
      subtotalWithoutDiscount: this.subtotalWithoutDiscount,
      totalDiscount: this.totalDiscount,
      total: this.total,
      // snapshot VO Price (quando existir)
      price: this._priceSnapshot ? this._priceSnapshot.toJSON() : null,
    };
  }
}
