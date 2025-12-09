// src/app/shared/components/ui/pagination/pagination.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    component.totalItems = 100;
    component.pageSize = 10;
    component.page = 1;
    fixture.detectChanges();
  });

  it('should create PaginationComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total pages correctly', () => {
    expect(component.totalPages).toBe(10);
  });
});
