// src/app/layout/header/header.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../core/services/auth.service';
import { LayoutService } from '../../core/services/layout.service';
import { NotificationService } from '../../core/services/notification.service';
import { RouterTestingModule } from '@angular/router/testing';

class AuthServiceStub {
  currentUser: any = null;
  logout = jasmine.createSpy('logout').and.resolveTo(undefined);
}

class NotificationServiceStub {
  success = jasmine.createSpy('success');
  error = jasmine.createSpy('error');
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule],
      providers: [
        LayoutService,
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: NotificationService, useClass: NotificationServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create HeaderComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should emit toggleSidebar when onToggleSidebar is called', () => {
    spyOn(component.toggleSidebar, 'emit');
    component.onToggleSidebar();
    expect(component.toggleSidebar.emit).toHaveBeenCalled();
  });
});
