// src/app/layout/shell/shell.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShellComponent } from './shell.component';
import { LayoutService } from '../../core/services/layout.service';

describe('ShellComponent', () => {
  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellComponent],
      providers: [LayoutService],
    }).compileComponents();

    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ShellComponent', () => {
    expect(component).toBeTruthy();
  });
});
