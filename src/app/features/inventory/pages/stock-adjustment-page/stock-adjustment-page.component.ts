// src/app/features/inventory/pages/stock-adjustment-page/stock-adjustment-page.component.ts
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { PageHeaderComponent } from '../../../../layout/page-header/page-header.component';
import { StockMovementFormComponent } from '../../components/stock-movement-form/stock-movement-form.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';

@Component({
  standalone: true,
  selector: 'app-stock-adjustment-page',
  imports: [
    CommonModule,
    PageHeaderComponent,
    StockMovementFormComponent,
    EmptyStateComponent,
  ],
  templateUrl: './stock-adjustment-page.component.html',
  styleUrls: ['./stock-adjustment-page.component.css'],
})
export class StockAdjustmentPageComponent {
  private readonly router = inject(Router);

  /**
   * Por enquanto deixei sempre true (ajuste direto).
   * Depois você pode trocar para lógica real baseada em rota/produto selecionado.
   */
  readonly hasSelection = signal(true);

  onGoToStock(): void {
    // rota real do dashboard de estoque é /inventory
    this.router.navigate(['/inventory']);
  }
}
