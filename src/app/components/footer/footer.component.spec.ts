// src/app/components/footer/footer.component.spec.ts

import { render, screen } from '@testing-library/angular';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  it('should create the component and render footer text', async () => {
    await render(FooterComponent);
    
    const footerText = screen.getByText('© 2025 Loja Virtual. Todos os direitos reservados.');
    
    // Usando Jasmine padrão
    expect(footerText).toBeTruthy();
  });
});
