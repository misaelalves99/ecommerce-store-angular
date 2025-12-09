// src/app/core/models/order.model.ts

import { BaseEntity } from './base-entity.model';
import { OrderItem } from './order-item.model';
import { Address } from './address.model';
import { OrderStatus } from '../enums/order-status.enum';
import { PaymentStatus } from '../enums/payment-status.enum';

export interface OrderProps {
  id: string;
  code: string;            // ex: #PED-2025-0001
  customerId: string;
  customerName: string;
  customerEmail?: string;

  items?: OrderItem[];

  status?: OrderStatus;
  paymentStatus?: PaymentStatus;

  couponCode?: string | null;

  // Totais de pedido
  subtotal?: number;          // subtotal sem frete (pode ser recalculado)
  discountTotal?: number;     // desconto de cupom (nível pedido)
  totalDiscount?: number;     // alias compatível (cupom)
  freightAmount?: number;
  total?: number;             // total final do pedido
  totalAmount?: number;       // alias compatível

  // Endereços
  billingAddress?: Address | null;
  shippingAddress?: Address | null;

  notes?: string | null;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

/**
 * Agregado principal de Pedido.
 *
 * Responsável por:
 * - Gerenciar itens (adicionar, remover, alterar quantidade).
 * - Recalcular totais (subtotal, descontos, frete, total).
 * - Controlar status do pedido e do pagamento.
 * - Manter snapshot dos dados básicos de cliente.
 */
export class Order extends BaseEntity<string> {
  private _code: string;
  private _customerId: string;
  private _customerName: string;
  private _customerEmail: string;

  private _items: OrderItem[];

  private _status: OrderStatus;
  private _paymentStatus: PaymentStatus;

  private _couponCode: string | null;

  /** Subtotal bruto (sem frete, sem cupom), baseado em itens */
  private _subtotal: number;

  /** Desconto de cupom (aplicado sobre subtotal após desconto de itens) */
  private _discountTotal: number;

  /** Frete do pedido */
  private _freightAmount: number;

  /** Total final = subtotal - descontoItens - descontoCupom + frete */
  private _total: number;

  private _billingAddress: Address | null;
  private _shippingAddress: Address | null;

  private _notes: string | null;

  private _totalItems: number = 0;  // número total de unidades (soma de quantity)

  constructor(props: OrderProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      deletedAt: props.deletedAt ?? null,
    });

    this._code = props.code.trim();
    this._customerId = props.customerId;
    this._customerName = props.customerName.trim();
    this._customerEmail = props.customerEmail?.trim().toLowerCase() ?? '';

    this._items = props.items ? [...props.items] : [];

    this._status = props.status ?? OrderStatus.PENDING;
    this._paymentStatus = props.paymentStatus ?? PaymentStatus.PENDING;

    this._couponCode = props.couponCode?.trim() ?? null;

    this._billingAddress = props.billingAddress ?? null;
    this._shippingAddress = props.shippingAddress ?? null;

    this._notes = props.notes?.trim() ?? null;

    this._freightAmount = Order.ensureNonNegative(props.freightAmount ?? 0);

    // Valores iniciais (serão recalculados)
    const discountFromProps =
      props.discountTotal ?? props.totalDiscount ?? 0;

    this._discountTotal = Order.ensureNonNegative(discountFromProps);
    this._subtotal = Order.ensureNonNegative(props.subtotal ?? 0);
    this._total = Order.ensureNonNegative(
      props.total ?? props.totalAmount ?? 0
    );

    // Recalcula a partir dos itens para garantir consistência
    this.recalculateTotals();
  }

  // ===== Getters =====

  get code(): string {
    return this._code;
  }

  get customerId(): string {
    return this._customerId;
  }

  get customerName(): string {
    return this._customerName;
  }

  get customerEmail(): string {
    return this._customerEmail;
  }

  get items(): OrderItem[] {
    return [...this._items];
  }

  get status(): OrderStatus {
    return this._status;
  }

  get paymentStatus(): PaymentStatus {
    return this._paymentStatus;
  }

  get couponCode(): string | null {
    return this._couponCode;
  }

  /**
   * Subtotal bruto baseado nos itens (sem frete, sem cupom).
   */
  get subtotal(): number {
    return this._subtotal;
  }

  /**
   * Desconto de cupom (nível pedido).
   * (Não inclui desconto dos itens; ver getters abaixo)
   */
  get discountTotal(): number {
    return this._discountTotal;
  }

  /**
   * Desconto total somado dos itens (OrderItem.totalDiscount).
   */
  get itemsDiscountTotal(): number {
    return Order.roundTwoDecimals(
      this._items.reduce((sum, item) => sum + item.totalDiscount, 0)
    );
  }

  /**
   * Desconto total global:
   *   descontoItens + descontoCupom
   */
  get totalDiscount(): number {
    return Order.roundTwoDecimals(
      this.itemsDiscountTotal + this._discountTotal
    );
  }

  get freightAmount(): number {
    return this._freightAmount;
  }

  get total(): number {
    return this._total;
  }

  /** Alias compatível com segundo modelo */
  get totalAmount(): number {
    return this._total;
  }

  /** Número total de unidades (soma das quantities) */
  get totalItems(): number {
    return this._totalItems;
  }

  get billingAddress(): Address | null {
    return this._billingAddress;
  }

  get shippingAddress(): Address | null {
    return this._shippingAddress;
  }

  get notes(): string | null {
    return this._notes;
  }

  // ===== Regras de negócio =====

  private static ensureNonNegative(value: number): number {
    if (value < 0) {
      throw new Error('Valor não pode ser negativo.');
    }
    return value;
  }

  private static roundTwoDecimals(value: number): number {
    return Math.round(value * 100) / 100;
  }

  /**
   * Recalcula subtotal, descontos e total a partir dos itens + frete + cupom.
   */
  recalculateTotals(): void {
    // Subtotal bruto dos itens (sem desconto por unidade)
    const itemsSubtotal = this._items.reduce(
      (acc, item) => acc + item.subtotalWithoutDiscount,
      0
    );

    // Desconto total dos itens
    const itemsDiscount = this._items.reduce(
      (acc, item) => acc + item.totalDiscount,
      0
    );

    this._subtotal = Order.roundTwoDecimals(itemsSubtotal);

    // Desconto de cupom não pode passar do valor dos itens após desconto de item
    const baseAfterItemDiscount = this._subtotal - itemsDiscount;
    const couponDiscount = Math.min(this._discountTotal, baseAfterItemDiscount);
    this._discountTotal = Order.roundTwoDecimals(
      Order.ensureNonNegative(couponDiscount)
    );

    const totalBase = baseAfterItemDiscount - this._discountTotal;
    const total = totalBase + this._freightAmount;

    this._total = Order.roundTwoDecimals(Math.max(0, total));
    this._totalItems = this._items.reduce(
      (acc, item) => acc + item.quantity,
      0
    );

    this.touch();
  }

  // --- Endereços ---

  setBillingAddress(address: Address | null): void {
    this._billingAddress = address;
    this.touch();
  }

  setShippingAddress(address: Address | null): void {
    this._shippingAddress = address;
    this.touch();
  }

  // --- Frete / cupom ---

  setFreightAmount(value: number): void {
    this._freightAmount = Order.ensureNonNegative(value);
    this.recalculateTotals();
  }

  setCoupon(code: string | null, discountValue: number): void {
    this._couponCode = code?.trim() ?? null;
    this._discountTotal = Order.ensureNonNegative(discountValue);
    this.recalculateTotals();
  }

  clearCoupon(): void {
    this._couponCode = null;
    this._discountTotal = 0;
    this.recalculateTotals();
  }

  // --- Itens ---

  /**
   * Adiciona um item ao pedido. Se o produto já existir, soma quantidade.
   */
  addItem(item: OrderItem): void {
    const existing = this._items.find((i) => i.productId === item.productId);

    if (existing) {
      existing.increaseQuantity(item.quantity);
    } else {
      this._items.push(item);
    }

    this.recalculateTotals();
  }

  /**
   * Remove item pelo ID interno do item.
   */
  removeItemById(itemId: string): void {
    const lengthBefore = this._items.length;
    this._items = this._items.filter((i) => i.id !== itemId);
    if (this._items.length !== lengthBefore) {
      this.recalculateTotals();
    }
  }

  /**
   * Remove item pelo productId (compatibilidade com segundo modelo).
   */
  removeItemByProductId(productId: string): void {
    const lengthBefore = this._items.length;
    this._items = this._items.filter((i) => i.productId !== productId);
    if (this._items.length !== lengthBefore) {
      this.recalculateTotals();
    }
  }

  /**
   * Wrapper genérico: tenta remover por itemId, se não achar tenta por productId.
   */
  removeItem(idOrProductId: string): void {
    const existsById = this._items.some((i) => i.id === idOrProductId);
    if (existsById) {
      this.removeItemById(idOrProductId);
      return;
    }
    this.removeItemByProductId(idOrProductId);
  }

  updateItemQuantityById(itemId: string, quantity: number): void {
    const item = this._items.find((i) => i.id === itemId);
    if (!item) return;
    item.changeQuantity(quantity);
    this.recalculateTotals();
  }

  updateItemQuantityByProductId(productId: string, quantity: number): void {
    const item = this._items.find((i) => i.productId === productId);
    if (!item) return;
    item.changeQuantity(quantity);
    this.recalculateTotals();
  }

  /** Alias compatível com primeiro modelo (usa itemId) */
  updateItemQuantity(itemId: string, quantity: number): void {
    this.updateItemQuantityById(itemId, quantity);
  }

  // --- Cliente snapshot ---

  updateCustomerSnapshot(params: {
    customerName?: string;
    customerEmail?: string;
  }): void {
    if (typeof params.customerName !== 'undefined') {
      this._customerName = params.customerName.trim();
    }
    if (typeof params.customerEmail !== 'undefined') {
      this._customerEmail = params.customerEmail.trim().toLowerCase();
    }
    this.touch();
  }

  // --- Status / pagamento ---

  changeStatus(status: OrderStatus): void {
    this._status = status;
    this.touch();
  }

  changePaymentStatus(status: PaymentStatus): void {
    this._paymentStatus = status;
    this.touch();
  }

  markAsPaid(): void {
    this._paymentStatus = PaymentStatus.PAID;
    this._status = OrderStatus.PAID;
    this.touch();
  }

  markAsCancelled(reason?: string): void {
    this._paymentStatus = PaymentStatus.CANCELLED;
    this._status = OrderStatus.CANCELLED;
    if (reason?.trim()) {
      const line = `Cancelado: ${reason.trim()}`;
      this._notes = this._notes ? `${this._notes}\n${line}` : line;
    }
    this.touch();
  }

  markAsShipped(): void {
    this._status = OrderStatus.SHIPPED;
    this.touch();
  }

  markAsDelivered(): void {
    this._status = OrderStatus.DELIVERED;
    this.touch();
  }

  // --- Anotações ---

  setNotes(value: string | null): void {
    this._notes = value?.trim() ?? null;
    this.touch();
  }

  addNote(note: string): void {
    const trimmed = note.trim();
    if (!trimmed) return;
    this._notes = this._notes ? `${this._notes}\n${trimmed}` : trimmed;
    this.touch();
  }

  override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      code: this._code,
      customerId: this._customerId,
      customerName: this._customerName,
      customerEmail: this._customerEmail,
      items: this._items.map((i) => i.toJSON()),
      status: this._status,
      paymentStatus: this._paymentStatus,
      couponCode: this._couponCode,
      subtotal: this._subtotal,
      discountTotal: this._discountTotal,        // cupom
      itemsDiscountTotal: this.itemsDiscountTotal,
      totalDiscount: this.totalDiscount,         // cupom + itens
      freightAmount: this._freightAmount,
      total: this._total,
      totalAmount: this._total,
      totalItems: this._totalItems,
      billingAddress: this._billingAddress
        ? (this._billingAddress as any).toJSON?.() ?? this._billingAddress
        : null,
      shippingAddress: this._shippingAddress
        ? (this._shippingAddress as any).toJSON?.() ?? this._shippingAddress
        : null,
      notes: this._notes,
    };
  }
}
