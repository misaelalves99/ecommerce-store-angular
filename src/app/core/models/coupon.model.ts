// src/app/core/models/coupon.model.ts

import { BaseEntity } from './base-entity.model';
import { DiscountType } from '../enums/discount-type.enum';

export interface CouponProps {
  id?: string;
  code: string;

  /** Nome amigável do cupom (opcional) */
  name?: string | null;

  description?: string | null;

  // Tipo e valor do desconto
  discountType: DiscountType;     // PERCENTAGE | FIXED_VALUE | FREIGHT etc.
  value: number;                  // % ou valor fixo, dependendo do tipo

  // Regras de valor / pedido
  maxDiscountValue?: number | null;   // teto para cupom percentual
  maxDiscountAmount?: number | null;  // alias compatível
  maxAmount?: number | null;          // alias compatível (legado)

  minOrderAmount?: number | null;     // canônico
  minOrderValue?: number | null;      // alias
  minAmount?: number | null;          // alias compatível

  // Controle de uso
  usageLimit?: number | null;     // null/undefined = ilimitado (canônico)
  maxUses?: number | null;        // alias compatível (form)
  currentUsage?: number;          // contador interno
  usedCount?: number;             // alias compatível

  // Escopo de aplicação
  appliesToFreight?: boolean;     // se pode descontar frete
  applicableBrandIds?: string[];
  applicableCategoryIds?: string[];
  applicableProductIds?: string[];

  // Janela de validade
  startsAt?: Date | null;         // canônico (início)
  expiresAt?: Date | null;        // canônico (fim)
  validFrom?: Date | null;        // alias compatível
  validUntil?: Date | null;       // alias compatível

  // Status & auditoria
  isActive?: boolean;
  active?: boolean;               // alias compatível
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

/**
 * Cupom de desconto.
 *
 * - Define tipo de desconto (percentual, valor fixo, frete, etc.).
 * - Contém regras de elegibilidade (mínimo de pedido, data, limite de uso).
 * - Suporta escopo por marca/categoria/produto para campanhas de marketing.
 */
export class Coupon extends BaseEntity<string> {
  private _code: string;
  private _name: string | null;
  private _description: string | null;

  private _discountType: DiscountType;
  private _value: number;

  private _maxDiscountValue: number | null;
  private _minOrderAmount: number | null;

  private _usageLimit: number | null;
  private _currentUsage: number;

  private _isActive: boolean;
  private _appliesToFreight: boolean;

  private _startsAt: Date | null;
  private _expiresAt: Date | null;

  private _applicableBrandIds: string[];
  private _applicableCategoryIds: string[];
  private _applicableProductIds: string[];

  constructor(props: CouponProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      deletedAt: props.deletedAt ?? null,
    });

    this._code = props.code.trim().toUpperCase();
    this._name = props.name?.trim() ?? null;
    this._description = props.description?.trim() ?? null;

    if (props.value <= 0) {
      throw new Error('Coupon value must be greater than zero.');
    }

    this._discountType = props.discountType;
    this._value = Coupon.ensureNonNegative(props.value);

    const maxValue =
      props.maxDiscountValue ??
      props.maxDiscountAmount ??
      props.maxAmount ??
      null;

    this._maxDiscountValue =
      maxValue !== null && maxValue !== undefined
        ? Coupon.ensureNonNegative(maxValue)
        : null;

    const minOrderRaw =
      props.minOrderAmount ??
      props.minOrderValue ??
      props.minAmount ??
      null;

    this._minOrderAmount =
      minOrderRaw !== null && minOrderRaw !== undefined
        ? Coupon.ensureNonNegative(minOrderRaw)
        : null;

    this._usageLimit =
      props.usageLimit ?? props.maxUses ?? null;

    this._currentUsage = props.currentUsage ?? props.usedCount ?? 0;

    this._isActive = props.isActive ?? props.active ?? true;
    this._appliesToFreight = props.appliesToFreight ?? false;

    this._startsAt = props.startsAt ?? props.validFrom ?? null;
    this._expiresAt = props.expiresAt ?? props.validUntil ?? null;

    this._applicableBrandIds = props.applicableBrandIds ?? [];
    this._applicableCategoryIds = props.applicableCategoryIds ?? [];
    this._applicableProductIds = props.applicableProductIds ?? [];
  }

  // ===== Getters =====

  get code(): string {
    return this._code;
  }

  get name(): string | null {
    return this._name;
  }

  get description(): string | null {
    return this._description;
  }

  get discountType(): DiscountType {
    return this._discountType;
  }

  /** Alias de leitura para compatibilidade com `type` */
  get type(): DiscountType {
    return this._discountType;
  }

  get value(): number {
    return this._value;
  }

  get maxDiscountValue(): number | null {
    return this._maxDiscountValue;
  }

  /** Alias de leitura para compatibilidade */
  get maxDiscountAmount(): number | null {
    return this._maxDiscountValue;
  }

  /** Alias genérico de compatibilidade (pode ser usado em DTOs) */
  get maxAmount(): number | null {
    return this._maxDiscountValue;
  }

  get minOrderAmount(): number | null {
    return this._minOrderAmount;
  }

  /** Alias de leitura para compatibilidade com o form */
  get minOrderValue(): number | null {
    return this._minOrderAmount;
  }

  /** Alias genérico de compatibilidade */
  get minAmount(): number | null {
    return this._minOrderAmount;
  }

  get usageLimit(): number | null {
    return this._usageLimit;
  }

  /** Alias para compatibilidade com maxUses (limite de uso) */
  get maxUses(): number | null {
    return this._usageLimit;
  }

  get currentUsage(): number {
    return this._currentUsage;
  }

  /** Alias para compatibilidade com usedCount */
  get usedCount(): number {
    return this._currentUsage;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  /** Alias para compatibilidade com `active` */
  get active(): boolean {
    return this._isActive;
  }

  get appliesToFreight(): boolean {
    return this._appliesToFreight;
  }

  get startsAt(): Date | null {
    return this._startsAt;
  }

  /** Alias compatível com validFrom */
  get validFrom(): Date | null {
    return this._startsAt;
  }

  get expiresAt(): Date | null {
    return this._expiresAt;
  }

  /** Alias compatível com validUntil */
  get validUntil(): Date | null {
    return this._expiresAt;
  }

  get applicableBrandIds(): string[] {
    return [...this._applicableBrandIds];
  }

  get applicableCategoryIds(): string[] {
    return [...this._applicableCategoryIds];
  }

  get applicableProductIds(): string[] {
    return [...this._applicableProductIds];
  }

  // ===== Regras de negócio =====

  private isWithinDateRange(now: Date): boolean {
    if (this._startsAt && now < this._startsAt) {
      return false;
    }
    if (this._expiresAt && now > this._expiresAt) {
      return false;
    }
    return true;
  }

  private hasUsageAvailable(): boolean {
    if (this._usageLimit === null) return true;
    return this._currentUsage < this._usageLimit;
  }

  private meetsMinOrderAmount(orderTotal: number): boolean {
    if (this._minOrderAmount === null) return true;
    return orderTotal >= this._minOrderAmount;
  }

  /**
   * Verifica se o cupom é válido para um pedido dado o total.
   */
  isValid(orderTotal: number, now: Date = new Date()): boolean {
    if (!this._isActive) return false;
    if (!this.isWithinDateRange(now)) return false;
    if (!this.hasUsageAvailable()) return false;
    if (!this.meetsMinOrderAmount(orderTotal)) return false;
    return true;
  }

  /**
   * Calcula o valor de desconto baseado no subtotal (e opcionalmente frete).
   * Respeita teto máximo e não ultrapassa o valor do pedido.
   */
  calculateDiscount(
    orderSubtotal: number,
    freightAmount = 0,
    now: Date = new Date(),
  ): number {
    if (!this.isValid(orderSubtotal + freightAmount, now)) {
      return 0;
    }

    let discount = 0;

    switch (this._discountType) {
      case DiscountType.PERCENTAGE: {
        const base = orderSubtotal;
        discount = (base * this._value) / 100;
        break;
      }

      case DiscountType.FREIGHT: {
        const base = this._appliesToFreight ? freightAmount : 0;
        discount = Math.min(this._value, base);
        break;
      }

      // FIXED_VALUE / FIXED_AMOUNT / outros tipos absolutos
      default: {
        discount = this._value;
        break;
      }
    }

    discount = Coupon.ensureNonNegative(discount);

    if (this._maxDiscountValue !== null) {
      discount = Math.min(discount, this._maxDiscountValue);
    }

    const maxAllowed = orderSubtotal + freightAmount;
    if (discount > maxAllowed) return maxAllowed;

    return discount;
  }

  /**
   * Registra o uso do cupom após pedido confirmado.
   */
  registerUsage(): void {
    this._currentUsage += 1;

    if (this._usageLimit !== null && this._currentUsage >= this._usageLimit) {
      this._isActive = false;
    }

    this.touch();
  }

  /** Alias compatível com o segundo modelo */
  incrementUsage(): void {
    this.registerUsage();
  }

  activate(): void {
    if (!this._isActive) {
      this._isActive = true;
      this.touch();
    }
  }

  deactivate(): void {
    if (this._isActive) {
      this._isActive = false;
      this.touch();
    }
  }

  override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      code: this._code,
      name: this._name,
      description: this._description,
      discountType: this._discountType,
      type: this._discountType, // alias
      value: this._value,

      maxDiscountValue: this._maxDiscountValue,
      maxDiscountAmount: this._maxDiscountValue,
      maxAmount: this._maxDiscountValue,

      minOrderAmount: this._minOrderAmount,
      minOrderValue: this._minOrderAmount,
      minAmount: this._minOrderAmount,

      usageLimit: this._usageLimit,
      maxUses: this._usageLimit,
      currentUsage: this._currentUsage,
      usedCount: this._currentUsage,

      isActive: this._isActive,
      active: this._isActive,
      appliesToFreight: this._appliesToFreight,

      startsAt: this._startsAt ? this._startsAt.toISOString() : null,
      expiresAt: this._expiresAt ? this._expiresAt.toISOString() : null,
      validFrom: this._startsAt ? this._startsAt.toISOString() : null,
      validUntil: this._expiresAt ? this._expiresAt.toISOString() : null,

      applicableBrandIds: this._applicableBrandIds,
      applicableCategoryIds: this._applicableCategoryIds,
      applicableProductIds: this._applicableProductIds,
    };
  }

  private static ensureNonNegative(value: number): number {
    if (value < 0) {
      throw new Error('Valor do cupom não pode ser negativo.');
    }
    return Math.round(value * 100) / 100;
  }
}
