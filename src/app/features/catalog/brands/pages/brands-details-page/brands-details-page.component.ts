// src/app/features/catalog/brands/pages/brands-details-page/brands-details-page.component.ts
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Brand } from '../../../../../core/models/brand.model';
import { CatalogService } from '../../../../../core/services/catalog.service';
import { NotificationService } from '../../../../../core/services/notification.service';

import { PageHeaderComponent } from '../../../../../layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';

@Component({
  standalone: true,
  selector: 'app-brands-details-page',
  imports: [CommonModule, PageHeaderComponent, ButtonComponent],
  templateUrl: './brands-details-page.component.html',
  styleUrls: ['./brands-details-page.component.css'],
})
export class BrandsDetailsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalogService = inject(CatalogService);
  private readonly notificationService = inject(NotificationService);

  readonly loading = signal(true);
  readonly brand = signal<Brand | null>(null);

  readonly brandId = computed(
    () => this.route.snapshot.paramMap.get('id') ?? '',
  );

  constructor() {
    this.loadBrand();
  }

  private loadBrand(): void {
    const id = this.brandId();
    if (!id) {
      this.router.navigate(['/catalog/brands']);
      return;
    }

    this.loading.set(true);

    this.catalogService.getBrandById(id).subscribe({
      next: (b) => {
        this.brand.set(b);
      },
      error: () => {
        this.notificationService.error(
          'Não foi possível carregar os detalhes da marca.',
        );
        this.router.navigate(['/catalog/brands']);
      },
      complete: () => this.loading.set(false),
    });
  }

  // ===== Navegação =====

  goBack(): void {
    this.router.navigate(['/catalog/brands']);
  }

  goToEdit(): void {
    const b = this.brand();
    if (!b) return;

    const anyB = b as any;
    const id = anyB.id ?? b.slug;

    if (!id) {
      this.router.navigate(['/catalog/brands']);
      return;
    }

    this.router.navigate(['/catalog/brands/edit', id]);
  }

  // ===== Helpers usados no template =====

  isInactive(): boolean {
    const b = this.brand();
    if (!b) return false;
    const anyB = b as any;
    return anyB.isActive === false || anyB.active === false;
  }

  getStatusLabel(): string {
    return this.isInactive() ? 'Inativa' : 'Ativa';
  }

  getDescription(): string {
    const b = this.brand();
    if (!b) return 'Sem descrição registrada.';
    return b.description?.trim()
      ? b.description
      : 'Sem descrição registrada.';
  }
}
