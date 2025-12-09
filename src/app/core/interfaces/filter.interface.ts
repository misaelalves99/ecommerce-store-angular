// src/app/core/interfaces/filter.interface.ts

/**
 * Direção de ordenação usada nas listagens.
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Filtro base compartilhado entre várias telas de listagem.
 * Ex.: Products, Categories, Brands, Customers, Orders...
 *
 * Cobre:
 * - busca textual genérica (search)
 * - paginação (page, pageSize)
 * - ordenação (sortBy, sortDirection)
 * - intervalo de datas (fromDate, toDate)
 */
export interface BaseFilter {
  /** Texto para busca livre (nome, código, SKU, email, etc.) */
  search?: string;

  /** Página atual (1-based) */
  page?: number;

  /** Tamanho da página (quantidade de itens por página) */
  pageSize?: number;

  /** Campo (chave) usado para ordenar, ex.: 'name', 'createdAt' */
  sortBy?: string;

  /** Direção da ordenação ('asc' | 'desc') */
  sortDirection?: SortDirection;

  /** Data inicial no formato ISO (YYYY-MM-DD ou ISO completo) */
  fromDate?: string;

  /** Data final no formato ISO (YYYY-MM-DD ou ISO completo) */
  toDate?: string;
}

/**
 * Filtro com suporte explícito a intervalo de datas.
 * Útil para relatórios, pedidos por período, etc.
 *
 * Mantém compatibilidade com startDate/endDate usados em algumas telas.
 */
export interface DateRangeFilter extends BaseFilter {
  /** Data inicial no formato ISO (YYYY-MM-DD ou ISO completo) */
  startDate?: string;

  /** Data final no formato ISO (YYYY-MM-DD ou ISO completo) */
  endDate?: string;
}

/**
 * Filtro genérico de catálogo (Products, Categories, Brands).
 * Pode ser estendido nas features para casos mais específicos.
 */
export interface CatalogFilter extends BaseFilter {
  /** Status ativo/inativo, quando aplicável */
  isActive?: boolean;

  /** IDs auxiliares (ex.: brandId, categoryId) */
  brandId?: string | number;
  categoryId?: string | number;
}

/**
 * Tipo auxiliar para montar filtros → query params.
 * Usado nos services ao montar `options.params`.
 */
export type FilterParams = {
  [param: string]:
    | string
    | number
    | boolean
    | readonly (string | number | boolean)[];
};

/**
 * Junta o BaseFilter com campos extras da feature.
 * Ex.: ProductFilter = FilterWithExtras<{ brandId?: string }>
 */
export type FilterWithExtras<TExtras extends object = {}> =
  BaseFilter & TExtras;
