// src/app/core/services/order.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { OrderService } from './order.service';
import { HttpService } from './http.service';
import { of } from 'rxjs';
import { OrderStatus } from '../enums/order-status.enum';

describe('OrderService', () => {
  let service: OrderService;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;

  beforeEach(() => {
    httpServiceSpy = jasmine.createSpyObj('HttpService', ['get', 'post', 'put', 'patch', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        OrderService,
        { provide: HttpService, useValue: httpServiceSpy },
      ],
    });

    service = TestBed.inject(OrderService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve chamar HttpService.patch ao atualizar status do pedido', () => {
    httpServiceSpy.patch.and.returnValue(of({} as any));

    service.updateOrderStatus('1', { status: OrderStatus.Completed }).subscribe();

    expect(httpServiceSpy.patch).toHaveBeenCalledWith(
      '/orders/1/status',
      { status: OrderStatus.Completed },
    );
  });
});
