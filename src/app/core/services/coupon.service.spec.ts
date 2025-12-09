// src/app/core/services/coupon.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { CouponService } from './coupon.service';
import { HttpService } from './http.service';
import { of } from 'rxjs';

describe('CouponService', () => {
  let service: CouponService;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;

  beforeEach(() => {
    httpServiceSpy = jasmine.createSpyObj('HttpService', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        CouponService,
        { provide: HttpService, useValue: httpServiceSpy },
      ],
    });

    service = TestBed.inject(CouponService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve chamar HttpService.post ao aplicar cupom', () => {
    httpServiceSpy.post.and.returnValue(of(undefined));

    service.applyCoupon({ code: 'DESCONTO10', orderId: '1' }).subscribe();

    expect(httpServiceSpy.post).toHaveBeenCalledWith(
      '/coupons/apply',
      { code: 'DESCONTO10', orderId: '1' },
    );
  });
});
