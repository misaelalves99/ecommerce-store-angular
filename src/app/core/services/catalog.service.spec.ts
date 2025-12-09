// src/app/core/services/catalog.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CatalogService } from './catalog.service';
import { HttpService } from './http.service';
import { Product } from '../models/product.model';
import { ApiResponse } from '../interfaces/api-response.interface';

describe('CatalogService', () => {
  let service: CatalogService;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;

  beforeEach(() => {
    httpServiceSpy = jasmine.createSpyObj<HttpService>('HttpService', [
      'get',
      'post',
      'put',
      'delete',
    ]);

    TestBed.configureTestingModule({
      providers: [
        CatalogService,
        { provide: HttpService, useValue: httpServiceSpy },
      ],
    });

    service = TestBed.inject(CatalogService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve chamar HttpService.get ao buscar produtos', () => {
    // simulando o formato atual: ApiResponse<T>
    const mockResponse: ApiResponse<any> = {
      data: {
        items: [],
        meta: {
          page: 1,
          pageSize: 10,
          totalItems: 0,
          totalPages: 0,
          hasNext: false,
          hasPrevious: false,
        },
      },
      success: true,
      message: 'OK',
    };

    httpServiceSpy.get.and.returnValue(of(mockResponse as any));

    service.getProducts().subscribe();

    // se quiser manter o path exato, pode usar toHaveBeenCalledWith
    expect(httpServiceSpy.get).toHaveBeenCalled();
  });

  it('deve chamar HttpService.post ao criar produto', () => {
    const product = { id: '1', name: 'Produto Teste' } as Product;

    const mockResponse: ApiResponse<Product> = {
      data: product,
      success: true,
      message: 'Criado com sucesso',
    };

    httpServiceSpy.post.and.returnValue(of(mockResponse as any));

    service.createProduct(product).subscribe();

    expect(httpServiceSpy.post).toHaveBeenCalled();
  });
});
