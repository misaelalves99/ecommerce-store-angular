// src/app/features/catalog/categories/components/category-form/category-form.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryFormComponent } from './category-form.component';

describe('CategoryFormComponent', () => {
  let component: CategoryFormComponent;
  let fixture: ComponentFixture<CategoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });
});
