// src/app/core/enums/order-status.enum.ts

/**
 * Status de um pedido no fluxo administrativo do e-commerce.
 *
 * Inclui variações de nomenclatura para compatibilidade:
 * - AWAITING_PAYMENT e PAYMENT_PENDING representam o mesmo estágio.
 */
export enum OrderStatus {
  PENDING = 'PENDING',                   // pedido criado
  AWAITING_PAYMENT = 'AWAITING_PAYMENT', // compatibilidade (antigo)
  PAYMENT_PENDING = 'PAYMENT_PENDING',   // aguardando confirmação do pagamento
  PAID = 'PAID',                         // pago, pronto para processamento
  PROCESSING = 'PROCESSING',             // separando itens / faturando
  SHIPPED = 'SHIPPED',                   // enviado para o cliente
  DELIVERED = 'DELIVERED',               // entregue ao cliente
  CANCELLED = 'CANCELLED',               // cancelado (antes de envio)
  RETURN_REQUESTED = 'RETURN_REQUESTED', // cliente pediu devolução
  RETURNED = 'RETURNED',                 // devolvido
  REFUNDED = 'REFUNDED',                 // reembolso efetuado
}

/**
 * Labels amigáveis para exibição no dashboard.
 */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Pendente',
  [OrderStatus.AWAITING_PAYMENT]: 'Aguardando pagamento',
  [OrderStatus.PAYMENT_PENDING]: 'Aguardando pagamento',
  [OrderStatus.PAID]: 'Pago',
  [OrderStatus.PROCESSING]: 'Em processamento',
  [OrderStatus.SHIPPED]: 'Enviado',
  [OrderStatus.DELIVERED]: 'Entregue',
  [OrderStatus.CANCELLED]: 'Cancelado',
  [OrderStatus.RETURN_REQUESTED]: 'Devolução solicitada',
  [OrderStatus.RETURNED]: 'Devolvido',
  [OrderStatus.REFUNDED]: 'Reembolsado',
};

/**
 * Mapeamento para “variant” de badge no dashboard (sucesso/alerta/perigo etc.).
 */
export type OrderStatusBadgeVariant =
  | 'info'
  | 'warning'
  | 'success'
  | 'danger'
  | 'neutral';

export const ORDER_STATUS_BADGE_VARIANT: Record<
  OrderStatus,
  OrderStatusBadgeVariant
> = {
  [OrderStatus.PENDING]: 'warning',
  [OrderStatus.AWAITING_PAYMENT]: 'warning',
  [OrderStatus.PAYMENT_PENDING]: 'warning',
  [OrderStatus.PAID]: 'info',
  [OrderStatus.PROCESSING]: 'info',
  [OrderStatus.SHIPPED]: 'info',
  [OrderStatus.DELIVERED]: 'success',
  [OrderStatus.CANCELLED]: 'danger',
  [OrderStatus.RETURN_REQUESTED]: 'warning',
  [OrderStatus.RETURNED]: 'info',
  [OrderStatus.REFUNDED]: 'success',
};
