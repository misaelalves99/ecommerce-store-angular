// src/app/features/settings/pages/settings-users-page/settings-users-page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsUsersPageComponent } from './settings-users-page.component';

describe('SettingsUsersPageComponent', () => {
  let component: SettingsUsersPageComponent;
  let fixture: ComponentFixture<SettingsUsersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsUsersPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsUsersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
