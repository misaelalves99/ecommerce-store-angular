import { inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ApiResponse } from '../interfaces/api-response.interface';
import { API_CONFIG } from '../config/api.config';
import { NotificationService } from './notification.service';

export interface HttpRequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?:
    | HttpParams
    | {
        [param: string]:
          | string
          | number
          | boolean
          | readonly (string | number | boolean)[];
      };
  withCredentials?: boolean;
}

// Alias para compatibilidade com código antigo
export type HttpOptions = HttpRequestOptions;

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly http = inject(HttpClient);
  private readonly notifications = inject(NotificationService);
  private readonly baseUrl = API_CONFIG.baseUrl.replace(/\/+$/, '');

  // ================== MÉTODOS PRINCIPAIS (ApiResponse<T>) ====================

  get<T>(
    path: string,
    options?: HttpRequestOptions,
  ): Observable<ApiResponse<T>> {
    return this.request<T>('GET', path, undefined, options);
  }

  post<T>(
    path: string,
    body: unknown,
    options?: HttpRequestOptions,
  ): Observable<ApiResponse<T>> {
    return this.request<T>('POST', path, body, options);
  }

  put<T>(
    path: string,
    body: unknown,
    options?: HttpRequestOptions,
  ): Observable<ApiResponse<T>> {
    return this.request<T>('PUT', path, body, options);
  }

  patch<T>(
    path: string,
    body: unknown,
    options?: HttpRequestOptions,
  ): Observable<ApiResponse<T>> {
    return this.request<T>('PATCH', path, body, options);
  }

  delete<T>(
    path: string,
    options?: HttpRequestOptions,
  ): Observable<ApiResponse<T>> {
    return this.request<T>('DELETE', path, undefined, options);
  }

  private request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    body?: unknown,
    options?: HttpRequestOptions,
  ): Observable<ApiResponse<T>> {
    const url = this.normalizeUrl(path);

    const request$ = this.http.request<ApiResponse<T>>(method, url, {
      body,
      ...options,
    });

    return request$.pipe(
      map((response) => {
        if (this.isApiResponse<T>(response)) {
          return response;
        }

        // Fallback: API não usa envelope ApiResponse
        return {
          data: response as unknown as T,
          success: true,
        } as ApiResponse<T>;
      }),
      catchError((error: HttpErrorResponse) => {
        const apiError: ApiResponse<T> = {
          data: null as unknown as T,
          success: false,
          error: {
            code: error.status || 'HTTP_ERROR',
            message: this.mapErrorMessage(
              error,
              'Ocorreu um erro ao comunicar com o servidor.',
            ),
            details: error.error,
          },
        };

        this.notifications.error(apiError.error!.message);
        return throwError(() => apiError);
      }),
    );
  }

  // ================== WRAPPERS "PLAIN" (T direto) ============================

  getPlain<T>(
    endpoint: string,
    options?: HttpOptions,
    defaultMessage = 'Erro ao carregar dados',
  ): Observable<T> {
    const url = this.normalizeUrl(endpoint);
    return this.http.get<T>(url, options).pipe(
      map((response) => response as T),
      catchError((error) => this.handleRawError(error, defaultMessage)),
    );
  }

  postPlain<T, B = unknown>(
    endpoint: string,
    body: B,
    options?: HttpOptions,
    defaultMessage = 'Erro ao salvar dados',
  ): Observable<T> {
    const url = this.normalizeUrl(endpoint);
    return this.http.post<T>(url, body, options).pipe(
      map((response) => response as T),
      catchError((error) => this.handleRawError(error, defaultMessage)),
    );
  }

  putPlain<T, B = unknown>(
    endpoint: string,
    body: B,
    options?: HttpOptions,
    defaultMessage = 'Erro ao atualizar dados',
  ): Observable<T> {
    const url = this.normalizeUrl(endpoint);
    return this.http.put<T>(url, body, options).pipe(
      map((response) => response as T),
      catchError((error) => this.handleRawError(error, defaultMessage)),
    );
  }

  patchPlain<T, B = unknown>(
    endpoint: string,
    body: B,
    options?: HttpOptions,
    defaultMessage = 'Erro ao atualizar dados',
  ): Observable<T> {
    const url = this.normalizeUrl(endpoint);
    return this.http.patch<T>(url, body, options).pipe(
      map((response) => response as T),
      catchError((error) => this.handleRawError(error, defaultMessage)),
    );
  }

  deletePlain<T>(
    endpoint: string,
    options?: HttpOptions,
    defaultMessage = 'Erro ao excluir dados',
  ): Observable<T> {
    const url = this.normalizeUrl(endpoint);
    return this.http.delete<T>(url, options).pipe(
      map((response) => response as T),
      catchError((error) => this.handleRawError(error, defaultMessage)),
    );
  }

  // ================== UTILS ===================================================

  private normalizeUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const base = this.baseUrl.replace(/\/+$/, '');
    const cleanPath = path.replace(/^\/+/, '');
    return `${base}/${cleanPath}`;
  }

  private isApiResponse<T>(value: unknown): value is ApiResponse<T> {
    return (
      !!value &&
      typeof value === 'object' &&
      'data' in value &&
      'success' in value
    );
  }

  private mapErrorMessage(
    error: HttpErrorResponse,
    defaultMessage = 'Ocorreu um erro inesperado. Tente novamente.',
  ): string {
    if (error.error?.message) {
      return error.error.message;
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return 'Sem conexão com a internet. Verifique sua rede e tente novamente.';
    }

    switch (error.status) {
      case 0:
        return 'Não foi possível conectar ao servidor. Tente novamente mais tarde.';
      case 400:
        return 'Requisição inválida. Verifique os dados informados.';
      case 401:
        return 'Não autorizado. Faça login novamente.';
      case 403:
        return 'Você não tem permissão para executar esta ação.';
      case 404:
        return 'Recurso não encontrado.';
      case 500:
        return 'Erro interno no servidor. Tente novamente mais tarde.';
      default:
        return defaultMessage;
    }
  }

  private handleRawError(error: HttpErrorResponse, defaultMessage: string) {
    const message = this.mapErrorMessage(error, defaultMessage);
    this.notifications.error(message);
    return throwError(() => error);
  }
}
