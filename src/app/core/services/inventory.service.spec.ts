// src/app/core/services/inventory.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { InventoryService } from './inventory.service';
import { HttpService } from './http.service';
import { of } from 'rxjs';

describe('InventoryService', () => {
  let service: InventoryService;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;

  beforeEach(() => {
    httpServiceSpy = jasmine.createSpyObj('HttpService', ['get', 'post']);

    TestBed.configureTestingModule({
      providers: [
        InventoryService,
        { provide: HttpService, useValue: httpServiceSpy },
      ],
    });

    service = TestBed.inject(InventoryService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve chamar HttpService.post ao ajustar estoque', () => {
    httpServiceSpy.post.and.returnValue(of({} as any));

    service.adjustStock({
      productId: '1',
      quantity: 10,
      reason: 'Entrada manual',
    }).subscribe();

    expect(httpServiceSpy.post).toHaveBeenCalledWith(
      '/inventory/adjust',
      { productId: '1', quantity: 10, reason: 'Entrada manual' },
    );
  });
});
