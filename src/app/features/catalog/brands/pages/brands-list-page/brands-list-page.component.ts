// src/app/features/catalog/brands/pages/brands-list-page/brands-list-page.component.ts
import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Brand } from '../../../../../core/models/brand.model';
import { CatalogService } from '../../../../../core/services/catalog.service';
import { NotificationService } from '../../../../../core/services/notification.service';

import { PageHeaderComponent } from '../../../../../layout/page-header/page-header.component';
import { SearchInputComponent } from '../../../../../shared/components/ui/search-input/search-input.component';
import { BrandTableComponent } from '../../components/brand-table/brand-table.component';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';

@Component({
  standalone: true,
  selector: 'app-brands-list-page',
  imports: [
    CommonModule,
    PageHeaderComponent,
    SearchInputComponent,
    BrandTableComponent,
    ButtonComponent,
  ],
  templateUrl: './brands-list-page.component.html',
  styleUrls: ['./brands-list-page.component.css'],
})
export class BrandsListPageComponent implements OnInit {
  private readonly catalogService = inject(CatalogService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly searchTerm = signal('');
  readonly brands = signal<Brand[]>([]);

  readonly filteredBrands = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.brands();

    return this.brands().filter((brand) => {
      const name = brand.name?.toLowerCase() ?? '';
      const slug = brand.slug?.toLowerCase() ?? '';
      return name.includes(term) || slug.includes(term);
    });
  });

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.loading.set(true);

    this.catalogService.getBrands().subscribe({
      next: (response: any) => {
        const data = response?.data ?? response;
        const items: Brand[] = Array.isArray(data)
          ? data
          : (data?.items as Brand[] | undefined) ?? [];

        this.brands.set(items);
      },
      error: () => {
        this.notificationService.error(
          'Não foi possível carregar a lista de marcas.',
        );
      },
      complete: () => this.loading.set(false),
    });
  }

  onCreate(): void {
    this.router.navigate(['/catalog/brands/create']);
  }

  onEdit(id: string): void {
    this.router.navigate(['/catalog/brands/edit', id]);
  }

  onDetails(id: string): void {
    this.router.navigate(['/catalog/brands/details', id]);
  }

  onDelete(id: string): void {
    this.router.navigate(['/catalog/brands/delete', id]);
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
  }
}
