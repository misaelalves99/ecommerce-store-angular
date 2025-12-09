// src/app/core/services/customer.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Customer } from '../models/customer.model';
import { ApiResponse } from '../interfaces/api-response.interface';
import { PaginatedResult } from '../interfaces/pagination.interface';
import { FilterParams } from '../interfaces/filter.interface';
import { CUSTOMERS_MOCK } from '../../testing/mocks/customers.mock';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  /**
   * Estado interno de clientes, inicializado com os mocks em memória.
   */
  private readonly customersSubject = new BehaviorSubject<Customer[]>(
    [...CUSTOMERS_MOCK] as unknown as Customer[],
  );

  /**
   * Lista clientes paginados.
   * Retorna ApiResponse<PaginatedResult<Customer>> (mesma assinatura de antes).
   */
  getCustomers(
    filters?: FilterParams,
  ): Observable<ApiResponse<PaginatedResult<Customer>>> {
    return this.customersSubject.asObservable().pipe(
      map((all) => {
        const page = Number((filters as any)?.page ?? 1);
        const pageSize = Number((filters as any)?.pageSize ?? 10);
        const search = String((filters as any)?.search ?? '')
          .toLowerCase()
          .trim();

        // 🔎 filtro simples por nome, e-mail ou documento
        let filtered = all;
        if (search) {
          filtered = all.filter((c) => {
            const name = (c as any).name?.toLowerCase() ?? '';
            const email = (c as any).email?.toLowerCase() ?? '';
            const document = (c as any).document?.toLowerCase() ?? '';
            return (
              name.includes(search) ||
              email.includes(search) ||
              document.includes(search)
            );
          });
        }

        const totalItems = filtered.length;
        const startIndex = (page - 1) * pageSize;
        const items = filtered.slice(startIndex, startIndex + pageSize);
        const totalPages =
          pageSize > 0 ? Math.max(1, Math.ceil(totalItems / pageSize)) : 1;

        // 👇 cast via unknown para satisfazer PaginatedResult<Customer> (que espera meta)
        const paginated = {
          items,
          page,
          pageSize,
          totalItems,
          totalPages,
        } as unknown as PaginatedResult<Customer>;

        return {
          data: paginated,
          success: true,
        } as ApiResponse<PaginatedResult<Customer>>;
      }),
    );
  }

  /**
   * Busca cliente por id.
   * Retorna ApiResponse<Customer> (mesma assinatura de antes).
   */
  getCustomerById(id: string): Observable<ApiResponse<Customer>> {
    return this.customersSubject.asObservable().pipe(
      map((all) => {
        const found =
          all.find((c) => String((c as any).id) === String(id)) ?? null;

        const response: ApiResponse<Customer> = {
          success: !!found,
          // evita passar null para Customer, que geraria o mesmo warning de conversão
          data: (found ?? ({} as Customer)) as Customer,
        };

        return response;
      }),
    );
  }

  /**
   * Cria cliente em memória.
   */
  createCustomer(customer: Customer): Observable<ApiResponse<Customer>> {
    const current = this.customersSubject.value;
    const now = new Date();

    const newId = this.generateId(current);

    const newCustomer: Customer = {
      ...(customer as any),
      id: (customer as any).id ?? newId,
      createdAt: (customer as any).createdAt ?? now,
      updatedAt: now,
    } as Customer;

    this.customersSubject.next([...current, newCustomer]);

    return of({
      data: newCustomer,
      success: true,
    } as ApiResponse<Customer>);
  }

  /**
   * Atualiza cliente em memória.
   */
  updateCustomer(
    id: string,
    customer: Customer,
  ): Observable<ApiResponse<Customer>> {
    const current = this.customersSubject.value;
    const now = new Date();
    let updatedCustomer: Customer | null = null;

    const updatedList = current.map((c) => {
      const currentId = String((c as any).id);
      if (currentId === String(id)) {
        updatedCustomer = {
          ...(c as any),
          ...(customer as any),
          id,
          updatedAt: now,
        } as Customer;
        return updatedCustomer;
      }
      return c;
    });

    if (!updatedCustomer) {
      return of({
        data: {} as Customer, // evita null -> Customer
        success: false,
      } as ApiResponse<Customer>);
    }

    this.customersSubject.next(updatedList);

    return of({
      data: updatedCustomer,
      success: true,
    } as ApiResponse<Customer>);
  }

  /**
   * Remove cliente em memória.
   */
  deleteCustomer(id: string): Observable<ApiResponse<null>> {
    const current = this.customersSubject.value;
    const filtered = current.filter(
      (c) => String((c as any).id) !== String(id),
    );

    this.customersSubject.next(filtered);

    return of({
      data: null,
      success: true,
    } as ApiResponse<null>);
  }

  /**
   * Gera um id simples baseado em números presentes nos ids existentes.
   * Ex.: cus-1001, cus-1002 → próximo vira "cus-1003".
   */
  private generateId(current: Customer[]): string {
    const numericIds = current
      .map((c) => {
        const rawId = String((c as any).id ?? '');
        const match = rawId.match(/\d+/g);
        if (!match) return 0;
        return Number(match.join('')) || 0;
      })
      .filter((n) => !Number.isNaN(n));

    const next = numericIds.length ? Math.max(...numericIds) + 1 : 1;
    return `cus-${next}`;
  }
}
