// src/app/core/interfaces/api-response.interface.ts

import type { PaginationMeta } from './pagination.interface';

/**
 * Modelo padrão para erros vindos da API ou simulados em mocks.
 */
export interface ApiError {
  /**
   * Código interno ou HTTP (ex: 'AUTH/INVALID_CREDENTIALS', 400, 500 etc.).
   */
  code: string | number;

  /**
   * Mensagem amigável para exibição.
   */
  message: string;

  /**
   * Campo relacionado ao erro (quando for erro de validação).
   */
  field?: string;

  /**
   * Detalhes adicionais que podem ajudar no debug.
   */
  details?: unknown;
}

/**
 * Metadados auxiliares que um endpoint pode devolver.
 * Usa Partial<PaginationMeta> para funcionar tanto em listas paginadas
 * quanto em endpoints simples.
 */
export interface ApiMeta extends Partial<PaginationMeta> {
  /**
   * Qualquer outra informação útil (ex: métricas agregadas, totais por status, etc.).
   */
  [key: string]: unknown;
}

/**
 * Envelope genérico de resposta da API.
 *
 * Exemplos:
 *  - ApiResponse<Product>
 *  - ApiResponse<Product[]>
 *  - ApiResponse<PaginatedResult<Order>>
 */
export interface ApiResponse<T> {
  /**
   * Payload principal da resposta (entidade, lista, objeto de domínio, etc.).
   * Em caso de erro, costuma vir como null.
   */
  data: T | null;

  /**
   * Indicador de sucesso do request.
   */
  success: boolean;

  /**
   * Mensagem amigável (opcional) para exibir em toasts ou alerts.
   */
  message?: string;

  /**
   * Metadados auxiliares (paginação, métricas, etc.).
   */
  meta?: ApiMeta;

  /**
   * Objeto de erro único quando success === false (modelo atual).
   */
  error?: ApiError;

  /**
   * Versão antiga em formato de lista (mantida por compatibilidade).
   * Pode ser uma lista estruturada ou apenas strings.
   */
  errors?: ApiError[] | string[];
}

/**
 * Resposta padrão para endpoints que devolvem lista paginada “achatada”
 * em vez de `PaginatedResult<T>`.
 *
 * Use somente se realmente precisar desse formato.
 */
export interface ApiPaginatedResponse<T> {
  success: boolean;
  items: T[];
  meta: PaginationMeta;
  message?: string;
  errors?: ApiError[] | string[];
}
