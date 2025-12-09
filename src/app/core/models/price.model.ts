// src/app/core/models/price.model.ts

import { DiscountType } from '../enums/discount-type.enum';

export interface PriceProps {
  baseAmount: number;            // preço cheio
  discountAmount?: number;       // valor de desconto (percentual ou fixo, dependendo do tipo)
  discountType?: DiscountType;   // FIXED_VALUE / FIXED_AMOUNT / PERCENTAGE / FREIGHT
  currencyCode?: string;         // ex: 'BRL', 'USD'
  installmentsMax?: number;      // máximo de parcelas sem juros
  interestRateMonthly?: number;  // juros ao mês para parcelas acima do limite sem juros
}

/**
 * Value Object de preço.
 *
 * Responsável por:
 * - Calcular preço final considerando tipo de desconto.
 * - Calcular total com juros para parcelamento.
 * - Expor helpers para exibição.
 *
 * Compatível com os dois modelos anteriores:
 * - VO puro (PriceProps)
 * - Modelo que usava amount/currency/discountValue.
 */
export class Price {
  private _baseAmount: number;
  private _discountAmount: number;
  private _discountType: DiscountType | null;
  private _currencyCode: string;
  private _installmentsMax: number;
  private _interestRateMonthly: number;

  constructor(props: PriceProps) {
    this._baseAmount = Price.ensurePositive(props.baseAmount);
    this._discountAmount = Price.ensureNonNegative(props.discountAmount ?? 0);
    this._discountType = props.discountType ?? null;
    this._currencyCode = (props.currencyCode ?? 'BRL').toUpperCase();
    this._installmentsMax = props.installmentsMax ?? 1;
    this._interestRateMonthly = props.interestRateMonthly ?? 0;
  }

  // ===== Getters principais =====

  /** Preço cheio (sem desconto) */
  get baseAmount(): number {
    return this._baseAmount;
  }

  /** Alias compatível com `amount` do modelo antigo */
  get amount(): number {
    return this._baseAmount;
  }

  /** Valor de desconto (percentual ou fixo, dependendo do tipo) */
  get discountAmount(): number {
    return this._discountAmount;
  }

  /** Alias compatível com `discountValue` do modelo antigo */
  get discountValue(): number {
    return this._discountAmount;
  }

  get discountType(): DiscountType | null {
    return this._discountType;
  }

  get currencyCode(): string {
    return this._currencyCode;
  }

  /** Alias compatível com `currency` do modelo antigo */
  get currency(): string {
    return this._currencyCode;
  }

  get installmentsMax(): number {
    return this._installmentsMax;
  }

  get interestRateMonthly(): number {
    return this._interestRateMonthly;
  }

  get hasDiscount(): boolean {
    return this._discountType !== null && this._discountAmount > 0;
  }

  /**
   * Preço final considerando o desconto.
   */
  get finalAmount(): number {
    let amount = this._baseAmount;

    if (this._discountType === DiscountType.PERCENTAGE) {
      // desconto percentual
      amount -= (amount * this._discountAmount) / 100;
    } else if (
      this._discountType === DiscountType.FIXED_AMOUNT ||
      this._discountType === DiscountType.FIXED_VALUE
    ) {
      // desconto em valor fixo
      amount -= this._discountAmount;
    }

    return Price.roundTwoDecimals(Math.max(0, amount));
  }

  // ===== Regras de negócio =====

  /**
   * Calcula o valor de cada parcela e o total, considerando:
   * - até installmentsMax → sem juros
   * - acima de installmentsMax → aplica interestRateMonthly
   */
  calculateInstallments(
    installments: number,
  ): { installmentValue: number; total: number } {
    const finalAmount = this.finalAmount;
    const safeInstallments = Math.max(1, Math.floor(installments));

    if (
      safeInstallments <= this._installmentsMax ||
      this._interestRateMonthly <= 0
    ) {
      const value = Price.roundTwoDecimals(finalAmount / safeInstallments);
      return {
        installmentValue: value,
        total: Price.roundTwoDecimals(value * safeInstallments),
      };
    }

    // juros compostos simples (pode ser refinado depois)
    const months = safeInstallments;
    const rate = this._interestRateMonthly / 100;
    const factor = Math.pow(1 + rate, months);
    const totalWithInterest = Price.roundTwoDecimals(finalAmount * factor);
    const installmentValue = Price.roundTwoDecimals(
      totalWithInterest / safeInstallments,
    );

    return {
      installmentValue,
      total: Price.roundTwoDecimals(installmentValue * safeInstallments),
    };
  }

  /**
   * Cria uma nova instância com desconto percentual aplicado.
   */
  withPercentageDiscount(percent: number): Price {
    return new Price({
      baseAmount: this._baseAmount,
      discountAmount: Math.max(0, percent),
      discountType: DiscountType.PERCENTAGE,
      currencyCode: this._currencyCode,
      installmentsMax: this._installmentsMax,
      interestRateMonthly: this._interestRateMonthly,
    });
  }

  /**
   * Cria uma nova instância com desconto fixo em moeda.
   * Usa FIXED_AMOUNT como padrão (podendo ser mapeado para FIXED_VALUE na API).
   */
  withFixedDiscount(amount: number): Price {
    return new Price({
      baseAmount: this._baseAmount,
      discountAmount: Math.max(0, amount),
      discountType: DiscountType.FIXED_AMOUNT,
      currencyCode: this._currencyCode,
      installmentsMax: this._installmentsMax,
      interestRateMonthly: this._interestRateMonthly,
    });
  }

  /**
   * “Remove” desconto (útil para campanhas finalizadas).
   */
  withoutDiscount(): Price {
    return new Price({
      baseAmount: this._baseAmount,
      discountAmount: 0,
      discountType: null as unknown as DiscountType, // será tratado como null internamente
      currencyCode: this._currencyCode,
      installmentsMax: this._installmentsMax,
      interestRateMonthly: this._interestRateMonthly,
    });
  }

  // ===== Mutação controlada =====

  setBaseAmount(amount: number): void {
    this._baseAmount = Price.ensurePositive(amount);
  }

  /** Alias compatível com setAmount do segundo modelo */
  setAmount(amount: number): void {
    this.setBaseAmount(amount);
  }

  setCurrencyCode(currency: string): void {
    this._currencyCode = currency.toUpperCase();
  }

  /** Alias compatível com setCurrency do segundo modelo */
  setCurrency(currency: string): void {
    this.setCurrencyCode(currency);
  }

  setDiscount(type: DiscountType, value: number): void {
    if (value < 0) {
      throw new Error('Discount value must be greater or equal to zero.');
    }
    this._discountType = type;
    this._discountAmount = Price.ensureNonNegative(value);
  }

  clearDiscount(): void {
    this._discountType = null;
    this._discountAmount = 0;
  }

  toJSON(): Record<string, unknown> {
    return {
      // naming do VO original
      baseAmount: this._baseAmount,
      discountAmount: this._discountAmount,
      discountType: this._discountType,
      currencyCode: this._currencyCode,
      installmentsMax: this._installmentsMax,
      interestRateMonthly: this._interestRateMonthly,

      // compatibilidade com segundo modelo
      amount: this._baseAmount,
      currency: this._currencyCode,
      discountValue: this._discountAmount,

      finalAmount: this.finalAmount,
    };
  }

  private static ensurePositive(value: number): number {
    if (value <= 0) {
      throw new Error('Preço base deve ser maior que zero.');
    }
    return Price.roundTwoDecimals(value);
  }

  private static ensureNonNegative(value: number): number {
    if (value < 0) {
      throw new Error('Valor não pode ser negativo.');
    }
    return Price.roundTwoDecimals(value);
  }

  private static roundTwoDecimals(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
