// src/app/layout/page-header/page-header.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageHeaderComponent } from './page-header.component';

describe('PageHeaderComponent', () => {
  let component: PageHeaderComponent;
  let fixture: ComponentFixture<PageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeaderComponent);
    component = fixture.componentInstance;
    component.title = 'Teste';
    fixture.detectChanges();
  });

  it('should create PageHeaderComponent', () => {
    expect(component).toBeTruthy();
  });
});
