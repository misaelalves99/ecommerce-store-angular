// src/app/features/settings/pages/settings-roles-page/settings-roles-page.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageHeaderComponent } from '../../../../layout/page-header/page-header.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { RolePermissionsFormComponent } from '../../components/role-permissions-form/role-permissions-form.component';

import { SettingsService } from '../../../../core/services/settings.service';
import { UserRole } from '../../../../core/enums/user-role.enum';
import { RolePermissions } from '../../../../core/models/role-permissions.model';

export type RolePermissionsViewModel = RolePermissions;

@Component({
  standalone: true,
  selector: 'app-settings-roles-page',
  imports: [
    CommonModule,
    PageHeaderComponent,
    BadgeComponent,
    EmptyStateComponent,
    RolePermissionsFormComponent,
  ],
  templateUrl: './settings-roles-page.component.html',
  styleUrls: ['./settings-roles-page.component.css'],
})
export class SettingsRolesPageComponent {
  private readonly settingsService = inject(SettingsService);

  readonly loading = signal<boolean>(true);
  readonly roles = signal<RolePermissionsViewModel[]>([]);
  readonly selectedRole = signal<RolePermissionsViewModel | null>(null);

  readonly userRole = UserRole; // atalho pro template, se precisar

  constructor() {
    this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      const data = await this.settingsService.getRolePermissions();
      this.roles.set(data);
      if (!this.selectedRole() && data.length) {
        this.selectedRole.set(data[0]);
      }
    } finally {
      this.loading.set(false);
    }
  }

  selectRole(role: RolePermissionsViewModel): void {
    this.selectedRole.set(role);
  }

  async onPermissionsSaved(value: RolePermissionsViewModel): Promise<void> {
    await this.settingsService.updateRolePermissions(value);
    await this.load();
  }
}
