// src/app/core/models/payment.model.ts

import { BaseEntity } from './base-entity.model';
import { PaymentStatus } from '../enums/payment-status.enum';

export type PaymentMethod =
  | 'CREDIT_CARD'
  | 'PIX'
  | 'BOLETO'
  | 'BANK_TRANSFER'
  | 'CASH'
  | 'OTHER';

export interface PaymentProps {
  id: string;
  orderId: string;

  amount: number;           // valor bruto cobrado
  feeAmount?: number;       // taxa do gateway
  currency?: string;        // BRL, USD, etc.

  status?: PaymentStatus;

  // Método / gateway
  method?: PaymentMethod | string | null;
  provider?: string | null;     // alias para gatewayName
  gatewayName?: string | null;  // alias para provider
  transactionId?: string | null;

  // Parcelamento / datas
  installments?: number | null;
  paidAt?: Date | null;
  dueDate?: Date | null;
  cancelledAt?: Date | null;

  // Motivo de cancelamento / falha
  cancelReason?: string | null;

  // Dados adicionais
  rawPayload?: unknown;
  metadata?: Record<string, unknown>;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

/**
 * Pagamento associado a um pedido.
 *
 * - Mantém snapshot de valores (bruto, taxa, líquido).
 * - Guarda método, gateway, transactionId e metadados.
 * - Controla transições de status (pendente, pago, cancelado, reembolsado).
 */
export class Payment extends BaseEntity<string> {
  private _orderId: string;

  private _amount: number;
  private _feeAmount: number;
  private _netAmount: number;
  private _currency: string;

  private _status: PaymentStatus;

  private _method: PaymentMethod | null;
  private _methodRaw: string | null;

  private _transactionId: string | null;
  private _provider: string | null;     // ex: Stripe, MercadoPago
  private _gatewayName: string | null;  // alias de provider

  private _installments: number | null;

  private _paidAt: Date | null;
  private _dueDate: Date | null;
  private _cancelledAt: Date | null;
  private _cancelReason: string | null;

  private _rawPayload: unknown;
  private _metadata: Record<string, unknown>;

  constructor(props: PaymentProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      deletedAt: props.deletedAt ?? null,
    });

    if (props.amount <= 0) {
      throw new Error('Payment amount must be greater than zero.');
    }

    this._orderId = props.orderId;

    this._amount = Payment.ensureNonNegative(props.amount);
    this._feeAmount = Payment.ensureNonNegative(props.feeAmount ?? 0);
    this._currency = props.currency ?? 'BRL';

    this._status = props.status ?? PaymentStatus.PENDING;

    const { methodEnum, methodRaw } = Payment.normalizeMethod(props.method);
    this._method = methodEnum;
    this._methodRaw = methodRaw;

    this._transactionId = props.transactionId?.trim() ?? null;

    const provider =
      props.provider?.trim() ?? props.gatewayName?.trim() ?? null;
    this._provider = provider;
    this._gatewayName = provider;

    this._installments = props.installments ?? null;

    this._paidAt = props.paidAt ?? null;
    this._dueDate = props.dueDate ?? null;
    this._cancelledAt = props.cancelledAt ?? null;
    this._cancelReason = props.cancelReason?.trim() ?? null;

    this._rawPayload = props.rawPayload ?? null;
    this._metadata = props.metadata ?? {};

    this._netAmount = this.calculateNetAmount();
  }

  // ===== Getters =====

  get orderId(): string {
    return this._orderId;
  }

  get amount(): number {
    return this._amount;
  }

  get feeAmount(): number {
    return this._feeAmount;
  }

  get netAmount(): number {
    return this._netAmount;
  }

  get currency(): string {
    return this._currency;
  }

  get status(): PaymentStatus {
    return this._status;
  }

  /** Método normalizado (enum) */
  get method(): PaymentMethod | null {
    return this._method;
  }

  /** Método como string original (ex: 'credit_card', 'pix') */
  get methodRaw(): string | null {
    return this._methodRaw;
  }

  /** Alias compatível para provider/gateway */
  get provider(): string | null {
    return this._provider;
  }

  get gatewayName(): string | null {
    return this._gatewayName;
  }

  get transactionId(): string | null {
    return this._transactionId;
  }

  get installments(): number | null {
    return this._installments;
  }

  get paidAt(): Date | null {
    return this._paidAt;
  }

  get dueDate(): Date | null {
    return this._dueDate;
  }

  get cancelledAt(): Date | null {
    return this._cancelledAt;
  }

  get cancelReason(): string | null {
    return this._cancelReason;
  }

  get rawPayload(): unknown {
    return this._rawPayload;
  }

  get metadata(): Record<string, unknown> {
    return { ...this._metadata };
  }

  // ===== Helpers internos =====

  private static ensureNonNegative(value: number): number {
    if (value < 0) {
      throw new Error('Valor não pode ser negativo.');
    }
    return Math.round(value * 100) / 100;
  }

  private static normalizeMethod(
    method?: PaymentMethod | string | null
  ): { methodEnum: PaymentMethod | null; methodRaw: string | null } {
    if (!method) {
      return { methodEnum: null, methodRaw: null };
    }

    const raw = method.toString().trim();
    if (!raw) {
      return { methodEnum: null, methodRaw: null };
    }

    const upper = raw.toUpperCase();
    const allowed: PaymentMethod[] = [
      'CREDIT_CARD',
      'PIX',
      'BOLETO',
      'BANK_TRANSFER',
      'CASH',
      'OTHER',
    ];

    if (allowed.includes(upper as PaymentMethod)) {
      return {
        methodEnum: upper as PaymentMethod,
        methodRaw: raw,
      };
    }

    return {
      methodEnum: 'OTHER',
      methodRaw: raw,
    };
  }

  private calculateNetAmount(): number {
    const net = this._amount - this._feeAmount;
    return net < 0 ? 0 : Payment.ensureNonNegative(net);
  }

  // ===== Mutação controlada =====

  setAmount(amount: number): void {
    if (amount <= 0) {
      throw new Error('Payment amount must be greater than zero.');
    }
    this._amount = Payment.ensureNonNegative(amount);
    this._netAmount = this.calculateNetAmount();
    this.touch();
  }

  setFeeAmount(feeAmount: number): void {
    if (feeAmount < 0) {
      throw new Error('Payment fee amount must be greater or equal to zero.');
    }
    this._feeAmount = Payment.ensureNonNegative(feeAmount);
    this._netAmount = this.calculateNetAmount();
    this.touch();
  }

  setMethod(method: PaymentMethod | string | null): void {
    const { methodEnum, methodRaw } = Payment.normalizeMethod(method);
    this._method = methodEnum;
    this._methodRaw = methodRaw;
    this.touch();
  }

  setProvider(provider: string | null): void {
    const trimmed = provider?.trim() ?? null;
    this._provider = trimmed;
    this._gatewayName = trimmed;
    this.touch();
  }

  setGatewayInfo(params: {
    gatewayName?: string | null;
    transactionId?: string | null;
  }): void {
    if (typeof params.gatewayName !== 'undefined') {
      this.setProvider(params.gatewayName);
    }
    if (typeof params.transactionId !== 'undefined') {
      this._transactionId = params.transactionId?.trim() ?? null;
    }
    this.touch();
  }

  setInstallments(installments: number | null): void {
    if (installments !== null && installments <= 0) {
      throw new Error('Número de parcelas deve ser maior que zero.');
    }
    this._installments = installments;
    this.touch();
  }

  setDueDate(date: Date | null): void {
    this._dueDate = date;
    this.touch();
  }

  setRawPayload(payload: unknown): void {
    this._rawPayload = payload;
    this.touch();
  }

  updateMetadata(metadata: Record<string, unknown>): void {
    this._metadata = { ...this._metadata, ...metadata };
    this.touch();
  }

  // ===== Fluxos de status =====

  markAsPending(): void {
    this._status = PaymentStatus.PENDING;
    this._paidAt = null;
    this._cancelledAt = null;
    this._cancelReason = null;
    this.touch();
  }

  markAsPaid(paidAt: Date = new Date()): void {
    this._status = PaymentStatus.PAID;
    this._paidAt = paidAt;
    this._cancelledAt = null;
    this._cancelReason = null;
    this.touch();
  }

  markAsFailed(reason?: string): void {
    this._status = PaymentStatus.FAILED;
    this._cancelReason = reason?.trim() ?? null;
    this.touch();
  }

  markAsCancelled(reason?: string, date: Date = new Date()): void {
    this._status = PaymentStatus.CANCELLED;
    this._cancelReason = reason?.trim() ?? null;
    this._cancelledAt = date;
    this.touch();
  }

  markAsRefunded(reason?: string): void {
    this._status = PaymentStatus.REFUNDED;
    this._cancelReason = reason?.trim() ?? null;
    this.touch();
  }

  override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      orderId: this._orderId,
      amount: this._amount,
      feeAmount: this._feeAmount,
      netAmount: this._netAmount,
      currency: this._currency,
      status: this._status,
      method: this._methodRaw ?? this._method,
      methodEnum: this._method,
      provider: this._provider,
      gatewayName: this._gatewayName,
      transactionId: this._transactionId,
      installments: this._installments,
      paidAt: this._paidAt ? this._paidAt.toISOString() : null,
      dueDate: this._dueDate ? this._dueDate.toISOString() : null,
      cancelledAt: this._cancelledAt
        ? this._cancelledAt.toISOString()
        : null,
      cancelReason: this._cancelReason,
      rawPayload: this._rawPayload,
      metadata: this._metadata,
    };
  }
}
