// src/app/core/utils/currency.utils.ts

/**
 * Utilitários de moeda focados em BRL (R$) e formato pt-BR.
 */

export function formatCurrencyBr(
  value: number | null | undefined,
  currency: string = 'BRL',
): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return 'R$ 0,00';
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Converte uma string no formato "1.234,56" para número.
 */
export function parseCurrencyBr(value: string): number {
  if (!value) return 0;

  const normalized = value
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
    .replace(/[^\d.-]/g, '');

  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
}
