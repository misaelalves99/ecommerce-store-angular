// src/app/features/settings/pages/settings-store-page/settings-store-page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsStorePageComponent } from './settings-store-page.component';

describe('SettingsStorePageComponent', () => {
  let component: SettingsStorePageComponent;
  let fixture: ComponentFixture<SettingsStorePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsStorePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsStorePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
