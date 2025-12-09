// src/app/features/catalog/brands/pages/brands-delete-page/brands-delete-page.component.ts
import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Brand } from '../../../../../core/models/brand.model';
import { CatalogService } from '../../../../../core/services/catalog.service';
import { NotificationService } from '../../../../../core/services/notification.service';

import { PageHeaderComponent } from '../../../../../layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';

type BrandWithMeta = Partial<Brand> & {
  id?: string | number;
  name?: string;
  slug?: string;
};

@Component({
  standalone: true,
  selector: 'app-brands-delete-page',
  imports: [CommonModule, PageHeaderComponent, ButtonComponent],
  templateUrl: './brands-delete-page.component.html',
  styleUrls: ['./brands-delete-page.component.css'],
})
export class BrandsDeletePageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalogService = inject(CatalogService);
  private readonly notificationService = inject(NotificationService);

  readonly loading = signal(true);
  readonly deleting = signal(false);
  readonly brand = signal<BrandWithMeta | null>(null);

  readonly brandId = computed(
    () => this.route.snapshot.paramMap.get('id') ?? '',
  );

  ngOnInit(): void {
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
      next: (response: any) => {
        const raw: any = response?.data ?? response;
        if (!raw) {
          this.notificationService.warning?.('Marca não encontrada.');
          this.router.navigate(['/catalog/brands']);
          return;
        }

        const enriched: BrandWithMeta = {
          ...(raw as Brand),
          id: raw.id ?? id,
          name: raw.name ?? '',
          slug: raw.slug ?? '',
        };

        this.brand.set(enriched);
      },
      error: () => {
        this.notificationService.error(
          'Não foi possível carregar a marca para exclusão.',
        );
        this.router.navigate(['/catalog/brands']);
      },
      complete: () => this.loading.set(false),
    });
  }

  async confirmDelete(): Promise<void> {
    const current = this.brand();
    if (!current) return;

    const id = (current as any).id ?? current.id;
    if (!id) return;

    this.deleting.set(true);

    this.catalogService.deleteBrand(String(id)).subscribe({
      next: () => {
        this.notificationService.success('Marca excluída com sucesso.');
        this.router.navigate(['/catalog/brands']);
      },
      error: (err) => {
        console.error(err);
        this.notificationService.error(
          'Ocorreu um erro ao excluir a marca. Tente novamente.',
        );
      },
      complete: () => this.deleting.set(false),
    });
  }

  cancel(): void {
    this.router.navigate(['/catalog/brands']);
  }
}
