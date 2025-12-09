// src/app/core/models/stock.model.ts

/**
 * Value Object / entidade de estoque.
 *
 * Unifica:
 * - Stock VO (quantity / reservedQuantity / minimumQuantityForWarning)
 * - Modelos antigos que usavam onHand / reserved / minimum / isBelowMinimum
 * - Adiciona campos opcionais de identificação (id, productId, sku, nomes de produto/marca/categoria)
 */

export interface StockProps {
  // Identificadores opcionais (para tabelas, trackBy etc.)
  id?: string;
  productId?: string;
  sku?: string;

  // Infos de exibição (dashboard / tabelas)
  productName?: string;
  brandName?: string;
  categoryName?: string;

  quantity?: number; // quantidade disponível total
  onHand?: number; // alias (modelo antigo)

  reservedQuantity?: number; // quantidade reservada
  reserved?: number; // alias (modelo antigo)

  minimumQuantityForWarning?: number; // abaixo disso → alerta de estoque baixo
  minimum?: number; // alias (modelo antigo)
}

export class Stock {
  // Identificadores opcionais
  private _id?: string;
  private _productId?: string;
  private _sku?: string;

  // Infos de exibição
  private _productName?: string;
  private _brandName?: string;
  private _categoryName?: string;

  // estado "canônico"
  private _quantity: number;
  private _reservedQuantity: number;
  private _minimumQuantityForWarning: number;

  constructor(props: StockProps) {
    this._id = props.id;
    this._productId = props.productId;
    this._sku = props.sku;

    this._productName = props.productName;
    this._brandName = props.brandName;
    this._categoryName = props.categoryName;

    const quantity = props.quantity ?? props.onHand ?? 0;
    const reserved = props.reservedQuantity ?? props.reserved ?? 0;
    const minimum = props.minimumQuantityForWarning ?? props.minimum ?? 5;

    this._quantity = Stock.ensureNonNegative(quantity);
    this._reservedQuantity = Stock.ensureNonNegative(reserved);
    this._minimumQuantityForWarning = Stock.ensureNonNegative(minimum);

    this.ensureConsistency();
  }

  // ===== Identificadores =====

  /** Id “principal” – usa id se existir, senão productId */
  get id(): string | undefined {
    return this._id ?? this._productId;
  }

  get productId(): string | undefined {
    return this._productId;
  }

  get sku(): string | undefined {
    return this._sku;
  }

  // ===== Infos de exibição =====

  get productName(): string | undefined {
    return this._productName;
  }

  get brandName(): string | undefined {
    return this._brandName;
  }

  get categoryName(): string | undefined {
    return this._categoryName;
  }

  // ===== Getters principais (VO original) =====

  /** Quantidade total em estoque (on-hand) */
  get quantity(): number {
    return this._quantity;
  }

  /** Alias compatível com modelo que usava onHand */
  get onHand(): number {
    return this._quantity;
  }

  /** Quantidade reservada (carrinhos, pedidos em aprovação) */
  get reservedQuantity(): number {
    return this._reservedQuantity;
  }

  /** Alias compatível com modelo que usava reserved */
  get reserved(): number {
    return this._reservedQuantity;
  }

  /** Quantidade efetivamente disponível (sem reservas) */
  get availableQuantity(): number {
    return Math.max(0, this._quantity - this._reservedQuantity);
  }

  /** Limite mínimo para disparar alerta de estoque baixo */
  get minimumQuantityForWarning(): number {
    return this._minimumQuantityForWarning;
  }

  /** Alias compatível com modelo que usava minimum */
  get minimum(): number {
    return this._minimumQuantityForWarning;
  }

  /** Indica se o estoque está abaixo (ou igual) ao mínimo esperado */
  get isLow(): boolean {
    return this.availableQuantity <= this._minimumQuantityForWarning;
  }

  /** Alias compatível com isBelowMinimum */
  get isBelowMinimum(): boolean {
    return this.isLow;
  }

  /** Alias amigável para componentes de UI (isLowStock) */
  get isLowStock(): boolean {
    return this.isLow;
  }

  /** Alias para currentStock em views */
  get currentStock(): number {
    return this._quantity;
  }

  /** Alias para minStock em views */
  get minStock(): number {
    return this._minimumQuantityForWarning;
  }

  // ===== Regras de negócio =====

  increase(amount: number): void {
    const safeAmount = Stock.ensureNonNegative(amount);
    if (safeAmount === 0) return;
    this._quantity += safeAmount;
    this.ensureConsistency();
  }

  add(quantity: number): void {
    this.increase(quantity);
  }

  decrease(amount: number): void {
    const safeAmount = Stock.ensureNonNegative(amount);
    if (safeAmount === 0) return;
    if (safeAmount > this.availableQuantity) {
      throw new Error('Quantidade para saída maior que estoque disponível.');
    }
    this._quantity -= safeAmount;
    this.ensureConsistency();
  }

  remove(quantity: number): void {
    this.decrease(quantity);
  }

  reserve(amount: number): void {
    const safeAmount = Stock.ensureNonNegative(amount);
    if (safeAmount === 0) return;
    if (safeAmount > this.availableQuantity) {
      throw new Error('Quantidade para reserva maior que estoque disponível.');
    }
    this._reservedQuantity += safeAmount;
    this.ensureConsistency();
  }

  release(amount: number): void {
    const safeAmount = Stock.ensureNonNegative(amount);
    if (safeAmount === 0) return;
    if (safeAmount > this._reservedQuantity) {
      throw new Error(
        'Quantidade para liberação maior que quantidade reservada.',
      );
    }
    this._reservedQuantity -= safeAmount;
    this.ensureConsistency();
  }

  updateMinimumQuantityForWarning(value: number): void {
    this._minimumQuantityForWarning = Stock.ensureNonNegative(value);
    this.ensureConsistency();
  }

  setMinimum(minimum: number): void {
    this.updateMinimumQuantityForWarning(minimum);
  }

  private ensureConsistency(): void {
    if (this._quantity < 0) this._quantity = 0;
    if (this._reservedQuantity < 0) this._reservedQuantity = 0;
    if (this._reservedQuantity > this._quantity) {
      this._reservedQuantity = this._quantity;
    }
  }

  toJSON(): Record<string, unknown> {
    return {
      // ids / identificação
      id: this._id,
      productId: this._productId,
      sku: this._sku,

      productName: this._productName,
      brandName: this._brandName,
      categoryName: this._categoryName,

      // naming do VO original
      quantity: this._quantity,
      reservedQuantity: this._reservedQuantity,
      availableQuantity: this.availableQuantity,
      minimumQuantityForWarning: this._minimumQuantityForWarning,
      isLow: this.isLow,

      // compatibilidade com modelo que usava onHand/minimum/isBelowMinimum
      onHand: this._quantity,
      reserved: this._reservedQuantity,
      minimum: this._minimumQuantityForWarning,
      isBelowMinimum: this.isLow,
      isLowStock: this.isLow,
      currentStock: this._quantity,
      minStock: this._minimumQuantityForWarning,
    };
  }

  private static ensureNonNegative(value: number): number {
    if (value < 0) {
      throw new Error('Quantidade não pode ser negativa.');
    }
    return value;
  }
}

/**
 * Movimento de estoque usado na tela de ajuste.
 */
export interface StockMovement {
  productId: string;
  quantity: number;
  /** 'IN' para entrada, 'OUT' para saída */
  operation: 'IN' | 'OUT';
  reason: string;
  createdAt?: Date;
}

/**
 * Tipo de item usado nas telas de overview de estoque (dashboard / tabela).
 * Alias direto para `Stock` para satisfazer os imports existentes.
 */
export type StockOverviewItem = Stock;
