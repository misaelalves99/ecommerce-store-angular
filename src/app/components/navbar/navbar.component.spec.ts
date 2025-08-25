// src/app/components/navbar/navbar.component.spec.ts

import { render, screen, fireEvent } from '@testing-library/angular';
import { NavbarComponent } from './navbar.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('NavbarComponent', () => {
  it('should render the navbar brand and links', async () => {
    await render(NavbarComponent, {
      imports: [RouterTestingModule]
    });

    // Verifica a logo e o texto da marca
    const brand = screen.getByText('Loja Virtual');
    expect(brand).toBeTruthy();

    const logo = screen.getByAltText('Ecommerce');
    expect(logo).toBeTruthy();

    // Verifica links principais
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('Produtos')).toBeTruthy();
    expect(screen.getByText('Categorias')).toBeTruthy();
    expect(screen.getByText('Marcas')).toBeTruthy();
  });

  it('should toggle navbar collapse on button click', async () => {
    const { fixture } = await render(NavbarComponent, {
      imports: [RouterTestingModule]
    });

    const toggleButton = screen.getByRole('button', { name: /toggle navigation/i });
    const navbarDiv = fixture.nativeElement.querySelector('#navbarMain');

    // Inicialmente colapsado
    expect(navbarDiv.classList).toContain('collapse');

    fireEvent.click(toggleButton);
    fixture.detectChanges();
    expect(navbarDiv.classList).not.toContain('collapse');

    fireEvent.click(toggleButton);
    fixture.detectChanges();
    expect(navbarDiv.classList).toContain('collapse');
  });
});
