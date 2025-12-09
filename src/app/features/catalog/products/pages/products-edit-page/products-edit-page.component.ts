// src/app/features/catalog/products/pages/products-edit-page/products-edit-page.component.ts

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { PageHeaderComponent } from '../../../../../layout/page-header/page-header.component';
import { CatalogService } from '../../../../../core/services/catalog.service';
import { Product } from '../../../../../core/models/product.model';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';

@Component({
  standalone: true,
  selector: 'app-products-edit-page',
  imports: [
    CommonModule,
    PageHeaderComponent,
    ProductFormComponent,
    ButtonComponent,
  ],
  templateUrl: './products-edit-page.component.html',
  styleUrls: ['./products-edit-page.component.css'],
})
export class ProductsEditPageComponent {
  private readonly catalogService = inject(CatalogService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  /** Produto carregado a partir do ID da rota. */
  readonly product = toSignal(
    this.catalogService.getProducts().pipe(
      map((result) => {
        const idParam = this.route.snapshot.paramMap.get('id');
        const items = result.items ?? [];

        if (!idParam) {
          return null;
        }

        return items.find((p) => String(p.id) === String(idParam)) ?? null;
      }),
    ),
    { initialValue: null as Product | null },
  );

  goBack(): void {
    this.router.navigate(['/catalog/products']);
  }

  handleSubmit(_value: any): void {
    // aqui depois você pode chamar um updateProduct no service
    this.router.navigate(['/catalog/products']);
  }
}
