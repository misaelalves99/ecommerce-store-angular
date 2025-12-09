// src/app/testing/utils/testing-module.utils.ts
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Provider, Type } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

/**
 * Configuração padrão para módulos de teste do projeto.
 * Inclui:
 * - HttpClientTestingModule
 * - RouterTestingModule
 * - NoopAnimationsModule
 */
export async function setupTestingModule(config: {
  imports?: any[];
  providers?: Provider[];
} = {}): Promise<void> {
  await TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      RouterTestingModule,
      NoopAnimationsModule,
      ...(config.imports ?? []),
    ],
    providers: [...(config.providers ?? [])],
  }).compileComponents();
}

/**
 * Helper para criar um fixture de componente standalone.
 *
 * Exemplo:
 * await setupTestingModule({ imports: [MeuComponente] });
 * const fixture = createComponent(MeuComponente);
 */
export function createComponent<T>(component: Type<T>): ComponentFixture<T> {
  const fixture = TestBed.createComponent(component);
  fixture.detectChanges();
  return fixture;
}

/**
 * Helper para resetar o TestBed entre suítes se necessário.
 */
export function resetTestingModule(): void {
  TestBed.resetTestingModule();
}
