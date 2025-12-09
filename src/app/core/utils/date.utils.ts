// src/app/core/utils/date.utils.ts

/**
 * Utilitários de data focados no padrão brasileiro (dd/MM/yyyy)
 * e conversões comuns em dashboards administrativos.
 */

export function toDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDateToBr(
  value: string | Date | null | undefined,
): string {
  const date = toDate(value);
  if (!date) return '';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatDateTimeToBr(
  value: string | Date | null | undefined,
): string {
  const date = toDate(value);
  if (!date) return '';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function toIsoString(value: string | Date): string {
  const date = toDate(value);
  return date ? date.toISOString() : '';
}

/**
 * Retorna o intervalo [from, to] padrão de últimos 30 dias em ISO.
 */
export function getLast30DaysRange(): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 30);

  return {
    from: from.toISOString(),
    to: to.toISOString(),
  };
}
