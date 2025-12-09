// src/app/shared/components/layout/breadcrumb/breadcrumb.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreadcrumbComponent } from './breadcrumb.component';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    component.items = [{ label: 'Catálogo', routerLink: ['/catalog'] }];
    fixture.detectChanges();
  });

  it('should create BreadcrumbComponent', () => {
    expect(component).toBeTruthy();
  });
});
