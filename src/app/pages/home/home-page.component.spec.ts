// src/app/pages/home/home-page.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './home-page.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), HomePageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve renderizar o título corretamente', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent)
      .toContain('Bem-vindo ao Painel Administrativo');
  });

  it('deve chamar navigateTo com o caminho correto (categorias)', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.navigateTo('/categories');
    expect(navigateSpy).toHaveBeenCalledWith(['/categories']);
  });

  it('deve chamar navigateTo quando botão "Gerenciar Marcas" for clicado', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button.btn-outline-primary') as HTMLButtonElement;
    button.click();
    expect(navigateSpy).toHaveBeenCalledWith(['/brands']);
  });

  it('deve chamar navigateTo quando botão "Gerenciar Produtos" for clicado', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button.btn-outline-dark') as HTMLButtonElement;
    button.click();
    expect(navigateSpy).toHaveBeenCalledWith(['/products']);
  });
});
