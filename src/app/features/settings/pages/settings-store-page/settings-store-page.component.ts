// src/app/features/settings/pages/settings-store-page/settings-store-page.component.ts

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageHeaderComponent } from '../../../../layout/page-header/page-header.component';
import { StoreSettingsFormComponent } from '../../components/store-settings-form/store-settings-form.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { SettingsService } from '../../../../core/services/settings.service';
import { StoreSettings } from '../../../../core/models/store-settings.model';

export type StoreSettingsViewModel = StoreSettings;

@Component({
  standalone: true,
  selector: 'app-settings-store-page',
  imports: [
    CommonModule,
    PageHeaderComponent,
    StoreSettingsFormComponent,
    EmptyStateComponent,
  ],
  templateUrl: './settings-store-page.component.html',
  styleUrls: ['./settings-store-page.component.css'],
})
export class SettingsStorePageComponent {
  private readonly settingsService = inject(SettingsService);

  readonly loading = signal<boolean>(true);
  readonly settings = signal<StoreSettingsViewModel | null>(null);

  constructor() {
    this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      const s = await this.settingsService.getStoreSettings();
      this.settings.set(s);
    } finally {
      this.loading.set(false);
    }
  }

  async onSaved(value: StoreSettingsViewModel): Promise<void> {
    await this.settingsService.updateStoreSettings(value);
    await this.load();
  }
}
