// src/app/core/utils/string.utils.ts

/**
 * Funções utilitárias para manipulação de strings,
 * muito usadas em filtros, buscas e exibição em tabela.
 */

export function capitalize(value: string): string {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function slugify(value: string): string {
  if (!value) return '';
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(
  value: string,
  maxLength: number,
  suffix: string = '...',
): string {
  if (!value) return '';
  if (value.length <= maxLength) return value;
  return value.slice(0, maxLength).trimEnd() + suffix;
}

export function normalizeSearchTerm(value: string): string {
  if (!value) return '';
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}
