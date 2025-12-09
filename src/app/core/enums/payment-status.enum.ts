// src/app/core/enums/payment-status.enum.ts

/**
 * Status de pagamento para um pedido.
 * Usado nos modelos Payment e Order.
 *
 * União dos status das duas versões, para cobrir:
 * - fluxo simples (PENDING → PROCESSING → PAID / FAILED / CANCELLED / REFUNDED)
 * - integrações mais ricas (AUTHORIZED, CHARGEBACK, EXPIRED, IN_REVIEW)
 */
export enum PaymentStatus {
  PENDING = 'PENDING',         // aguardando tentativa de pagamento
  PROCESSING = 'PROCESSING',   // gateway processando
  AUTHORIZED = 'AUTHORIZED',   // autorizado pelo gateway, não capturado
  PAID = 'PAID',               // pago com sucesso
  FAILED = 'FAILED',           // falha na cobrança
  CANCELLED = 'CANCELLED',     // cancelado (antes de concluir)
  REFUNDED = 'REFUNDED',       // valor reembolsado
  CHARGEBACK = 'CHARGEBACK',   // contestação / chargeback
  EXPIRED = 'EXPIRED',         // expirado (boleto, link, etc.)
  IN_REVIEW = 'IN_REVIEW',     // em análise manual (fraude, verificação)
}

/**
 * Labels amigáveis para exibição em tabelas e detalhes.
 */
export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'Pendente',
  [PaymentStatus.PROCESSING]: 'Processando',
  [PaymentStatus.AUTHORIZED]: 'Autorizado',
  [PaymentStatus.PAID]: 'Pago',
  [PaymentStatus.FAILED]: 'Falhou',
  [PaymentStatus.CANCELLED]: 'Cancelado',
  [PaymentStatus.REFUNDED]: 'Reembolsado',
  [PaymentStatus.CHARGEBACK]: 'Chargeback',
  [PaymentStatus.EXPIRED]: 'Expirado',
  [PaymentStatus.IN_REVIEW]: 'Em análise',
};

export type PaymentStatusBadgeVariant =
  | 'info'
  | 'warning'
  | 'success'
  | 'danger'
  | 'neutral';

export const PAYMENT_STATUS_BADGE_VARIANT: Record<
  PaymentStatus,
  PaymentStatusBadgeVariant
> = {
  [PaymentStatus.PENDING]: 'warning',
  [PaymentStatus.PROCESSING]: 'info',
  [PaymentStatus.AUTHORIZED]: 'info',
  [PaymentStatus.PAID]: 'success',
  [PaymentStatus.FAILED]: 'danger',
  [PaymentStatus.CANCELLED]: 'neutral',
  [PaymentStatus.REFUNDED]: 'success',
  [PaymentStatus.CHARGEBACK]: 'danger',
  [PaymentStatus.EXPIRED]: 'neutral',
  [PaymentStatus.IN_REVIEW]: 'info',
};
