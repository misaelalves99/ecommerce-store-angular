// src/app/features/settings/components/role-permissions-form/role-permissions-form.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RolePermissionsFormComponent } from './role-permissions-form.component';

describe('RolePermissionsFormComponent', () => {
  let component: RolePermissionsFormComponent;
  let fixture: ComponentFixture<RolePermissionsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolePermissionsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RolePermissionsFormComponent);
    component = fixture.componentInstance;
    component.value = {
      role: 'Admin' as any,
      description: 'Admin padrão',
      permissions: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
