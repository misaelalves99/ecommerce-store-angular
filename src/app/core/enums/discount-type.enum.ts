// src/app/core/enums/discount-type.enum.ts

/**
 * Tipos de desconto aceitos pelo sistema de cupons/regra de preço.
 *
 * - FIXED_VALUE  / FIXED_AMOUNT: valor fixo abatido do total.
 * - PERCENTAGE: desconto percentual em cima do subtotal do pedido.
 * - FREIGHT: desconto aplicado especificamente sobre o valor do frete.
 *
 * FIXED_VALUE e FIXED_AMOUNT existem por compatibilidade de código legado.
 */
export enum DiscountType {
  FIXED_VALUE = 'FIXED_VALUE',       // valor fixo (compat)
  FIXED_AMOUNT = 'FIXED_AMOUNT',     // valor fixo (nova nomenclatura)
  PERCENTAGE = 'PERCENTAGE',         // percentual (%)
  FREIGHT = 'FREIGHT',               // desconto sobre o frete
  NONE = 'NONE',
}

/**
 * Labels amigáveis para exibição.
 */
export const DISCOUNT_TYPE_LABELS: Record<DiscountType, string> = {
  [DiscountType.FIXED_VALUE]: 'Valor fixo',
  [DiscountType.FIXED_AMOUNT]: 'Valor fixo',
  [DiscountType.PERCENTAGE]: 'Percentual',
  [DiscountType.FREIGHT]: 'Frete',
  [DiscountType.NONE]: 'Nenhum',
};

/**
 * Alias de compatibilidade:
 * permite usar `DiscountTypeEnum.PERCENTAGE` etc.
 * (usado pelo formulário de cupons e por código legado).
 */
export const DiscountTypeEnum = DiscountType;
