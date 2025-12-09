// src/app/features/catalog/products/pages/products-details-page/products-details-page.component.ts
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

import { PageHeaderComponent } from '../../../../../layout/page-header/page-header.component';
import { CardComponent } from '../../../../../shared/components/ui/card/card.component';
import { BadgeComponent } from '../../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';

import { CurrencyBrPipe } from '../../../../../shared/pipes/currency-br.pipe';
import { DateBrPipe } from '../../../../../shared/pipes/date-br.pipe';

import { CatalogService } from '../../../../../core/services/catalog.service';
import { Product } from '../../../../../core/models/product.model';

@Component({
  standalone: true,
  selector: 'app-products-details-page',
  imports: [
    CommonModule,
    RouterLink,
    PageHeaderComponent,
    CardComponent,
    BadgeComponent,
    ButtonComponent,
    CurrencyBrPipe,
    DateBrPipe,
  ],
  templateUrl: './products-details-page.component.html',
  styleUrls: ['./products-details-page.component.css'],
})
export class ProductsDetailsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly catalogService = inject(CatalogService);

  private readonly idSig = computed(
    () => this.route.snapshot.paramMap.get('id') ?? '',
  );

  // Converte ApiResponse<Product> -> Product | null antes de virar Signal
  readonly productSig = toSignal<Product | null>(
    this.catalogService.getProductById(this.idSig()).pipe(
      map((response) => (response.data as Product | null) ?? null),
    ),
    { initialValue: null },
  );
}
