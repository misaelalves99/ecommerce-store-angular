// src/app/features/settings/pages/settings-roles-page/settings-roles-page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsRolesPageComponent } from './settings-roles-page.component';

describe('SettingsRolesPageComponent', () => {
  let component: SettingsRolesPageComponent;
  let fixture: ComponentFixture<SettingsRolesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsRolesPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsRolesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
