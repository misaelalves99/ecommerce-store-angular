// src/app/shared/components/ui/modal/modal.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    component.open = true;
    fixture.detectChanges();
  });

  it('should create ModalComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closed when handleClose is called', () => {
    spyOn(component.closed, 'emit');
    component.handleClose();
    expect(component.closed.emit).toHaveBeenCalled();
  });
});
