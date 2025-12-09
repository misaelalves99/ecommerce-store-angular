// src/app/core/interfaces/pagination.interface.ts

/**
 * Metadados de paginação retornados pela API.
 * Usado em listas de Products, Orders, Customers, etc.
 */
export interface PaginationMeta {
  /** Página atual (1-based) */
  page: number;

  /** Tamanho da página (quantidade de itens por página) */
  pageSize: number;

  /** Total de registros encontrados na consulta */
  totalItems: number;

  /** Total de páginas calculado com base em totalItems/pageSize */
  totalPages: number;

  /** Indica se existe página anterior */
  hasPreviousPage: boolean;

  /** Indica se existe próxima página */
  hasNextPage: boolean;
}

/**
 * Parâmetros básicos de paginação enviados na query string.
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

/**
 * Envelope de resposta paginada genérica.
 * Combina os itens com os metadados de paginação.
 */
export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

/**
 * Alias para compatibilidade com código/specs antigos.
 * Pagination<T> == PaginatedResult<T>
 */
export type Pagination<T> = PaginatedResult<T>;
