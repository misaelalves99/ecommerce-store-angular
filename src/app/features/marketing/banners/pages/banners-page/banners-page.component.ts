// src/app/features/marketing/banners/pages/banners-page/banners-page.component.ts

import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerFormComponent } from '../../components/banner-form/banner-form.component';
import { PageHeaderComponent } from '../../../../../layout/page-header/page-header.component';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button.component';
import { EmptyStateComponent } from '../../../../../shared/components/ui/empty-state/empty-state.component';
import { Banner } from '../../../../../core/models/banner.model';
import { MarketingService } from '../../../../../core/services/marketing.service';

@Component({
  standalone: true,
  selector: 'app-banners-page',
  imports: [
    CommonModule,
    BannerFormComponent,
    PageHeaderComponent,
    ButtonComponent,
    EmptyStateComponent,
  ],
  templateUrl: './banners-page.component.html',
  styleUrls: ['./banners-page.component.css'],
})
export class BannersPageComponent {
  private readonly marketingService = inject(MarketingService);

  readonly loading = signal<boolean>(true);
  readonly banners = signal<Banner[]>([]);
  readonly selectedBanner = signal<Banner | null>(null);
  readonly hasBanners = computed(() => this.banners().length > 0);

  constructor() {
    this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      const list = await this.marketingService.getBanners();
      this.banners.set(list);
      this.selectedBanner.set(list[0] ?? null);
    } finally {
      this.loading.set(false);
    }
  }

  async onBannerSaved(banner: Banner): Promise<void> {
    await this.marketingService.upsertBanner(banner);
    await this.load();
  }

  onCreateNew(): void {
    this.selectedBanner.set(null);
  }

  onSelectBanner(banner: Banner): void {
    this.selectedBanner.set(banner);
  }
}
