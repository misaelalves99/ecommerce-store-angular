// src/app/core/services/customer.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { CustomerService } from './customer.service';
import { HttpService } from './http.service';
import { of } from 'rxjs';
import { Customer } from '../models/customer.model';

describe('CustomerService', () => {
  let service: CustomerService;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;

  beforeEach(() => {
    httpServiceSpy = jasmine.createSpyObj('HttpService', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        CustomerService,
        { provide: HttpService, useValue: httpServiceSpy },
      ],
    });

    service = TestBed.inject(CustomerService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve chamar HttpService.get ao buscar clientes', () => {
    httpServiceSpy.get.and.returnValue(of({ items: [], total: 0 } as any));

    service.getCustomers().subscribe();

    expect(httpServiceSpy.get).toHaveBeenCalledWith('/customers', { params: undefined });
  });

  it('deve chamar HttpService.post ao criar cliente', () => {
    const customer = { id: '1', name: 'Cliente Teste' } as Customer;
    httpServiceSpy.post.and.returnValue(of(customer));

    service.createCustomer(customer).subscribe();

    expect(httpServiceSpy.post).toHaveBeenCalled();
  });
});
