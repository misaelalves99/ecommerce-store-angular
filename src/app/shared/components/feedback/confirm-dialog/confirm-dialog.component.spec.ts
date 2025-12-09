// src/app/shared/components/feedback/confirm-dialog/confirm-dialog.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    component.open = true;
    fixture.detectChanges();
  });

  it('should create ConfirmDialogComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should emit confirmed', () => {
    spyOn(component.confirmed, 'emit');
    component.handleConfirm();
    expect(component.confirmed.emit).toHaveBeenCalled();
  });

  it('should emit canceled', () => {
    spyOn(component.canceled, 'emit');
    component.handleCancel();
    expect(component.canceled.emit).toHaveBeenCalled();
  });
});
