// src/app/features/settings/components/store-settings-form/store-settings-form.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreSettingsFormComponent } from './store-settings-form.component';

describe('StoreSettingsFormComponent', () => {
  let component: StoreSettingsFormComponent;
  let fixture: ComponentFixture<StoreSettingsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreSettingsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StoreSettingsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
