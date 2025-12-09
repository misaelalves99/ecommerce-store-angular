// src/app/shared/components/ui/button/button.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ButtonComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should emit appClick when clicked and not disabled', () => {
    spyOn(component.appClick, 'emit');
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();
    expect(component.appClick.emit).toHaveBeenCalled();
  });

  it('should not emit when disabled', () => {
    spyOn(component.appClick, 'emit');
    component.disabled = true;
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();
    expect(component.appClick.emit).not.toHaveBeenCalled();
  });
});
