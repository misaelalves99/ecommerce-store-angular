// src/app/app.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule, NavbarComponent, FooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render app-navbar', () => {
    const navbarEl = fixture.debugElement.query(By.css('app-navbar'));
    expect(navbarEl).toBeTruthy();
  });

  it('should render router-outlet', () => {
    const routerOutletEl = fixture.debugElement.query(By.css('router-outlet'));
    expect(routerOutletEl).toBeTruthy();
  });

  it('should render app-footer', () => {
    const footerEl = fixture.debugElement.query(By.css('app-footer'));
    expect(footerEl).toBeTruthy();
  });
});
