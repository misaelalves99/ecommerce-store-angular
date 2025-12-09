// src/app/core/services/report.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { ReportService } from './report.service';
import { HttpService } from './http.service';
import { of } from 'rxjs';

describe('ReportService', () => {
  let service: ReportService;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;

  beforeEach(() => {
    httpServiceSpy = jasmine.createSpyObj('HttpService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        ReportService,
        { provide: HttpService, useValue: httpServiceSpy },
      ],
    });

    service = TestBed.inject(ReportService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve chamar HttpService.get ao buscar métricas do dashboard', () => {
    httpServiceSpy.get.and.returnValue(of({} as any));

    service.getDashboardMetrics().subscribe();

    expect(httpServiceSpy.get).toHaveBeenCalledWith('/reports/dashboard');
  });
});
