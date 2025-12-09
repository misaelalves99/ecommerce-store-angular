// src/app/core/config/api.config.ts
import { environment } from '../../../environments/environment';

export interface ApiConfig {
  baseUrl: string;
  timeoutMs: number;
  retryCount: number;
  mockDelayMs: number;
  cacheTtlMs: number;
}

/**
 * Configuração central da API.
 *
 * - baseUrl: URL base para todas as chamadas HTTP.
 * - timeoutMs: tempo máximo antes de considerar timeout.
 * - retryCount: número padrão de tentativas de reexecução.
 * - mockDelayMs: delay artificial para simular latência (útil em dev).
 * - cacheTtlMs: tempo de vida padrão de respostas em cache.
 */
export const API_CONFIG: ApiConfig = {
  // usa a propriedade correta do environment
  baseUrl: environment.apiBaseUrl ?? 'https://api.local-ecommerce.com',
  timeoutMs: 15000,
  retryCount: 1,
  mockDelayMs: environment.production ? 0 : 400,
  cacheTtlMs: 1000 * 60 * 5, // 5 minutos
};
