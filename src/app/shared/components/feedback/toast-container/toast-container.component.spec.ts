// src/app/shared/components/feedback/toast-container/toast-container.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastContainerComponent } from './toast-container.component';

describe('ToastContainerComponent', () => {
  let component: ToastContainerComponent;
  let fixture: ComponentFixture<ToastContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastContainerComponent);
    component = fixture.componentInstance;
    component.toasts = [
      { id: '1', type: 'success', title: 'Sucesso' },
    ];
    fixture.detectChanges();
  });

  it('should create ToastContainerComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should emit dismiss event', () => {
    spyOn(component.dismiss, 'emit');
    component.onDismiss('1');
    expect(component.dismiss.emit).toHaveBeenCalledWith('1');
  });
});
