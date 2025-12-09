// src/app/layout/sidebar/sidebar.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { LayoutService } from '../../core/services/layout.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent, RouterTestingModule],
      providers: [LayoutService],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create SidebarComponent', () => {
    expect(component).toBeTruthy();
  });
});
