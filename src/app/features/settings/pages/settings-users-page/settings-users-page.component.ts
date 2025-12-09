// src/app/features/settings/pages/settings-users-page/settings-users-page.component.ts
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageHeaderComponent } from '../../../../layout/page-header/page-header.component';
import { TableComponent } from '../../../../shared/components/ui/table/table.component';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { SearchInputComponent } from '../../../../shared/components/ui/search-input/search-input.component';
import { EmptyStateComponent } from '../../../../shared/components/ui/empty-state/empty-state.component';
import { PaginationComponent } from '../../../../shared/components/ui/pagination/pagination.component';
import { ModalComponent } from '../../../../shared/components/ui/modal/modal.component';

import { SettingsService } from '../../../../core/services/settings.service';
import { UserModel } from '../../../../core/models/user.model';
import { UserRole } from '../../../../core/enums/user-role.enum';
import { UserFormComponent } from '../../components/user-form/user-form.component';

@Component({
  standalone: true,
  selector: 'app-settings-users-page',
  imports: [
    CommonModule,
    PageHeaderComponent,
    TableComponent,
    BadgeComponent,
    ButtonComponent,
    SearchInputComponent,
    EmptyStateComponent,
    PaginationComponent,
    ModalComponent,
    UserFormComponent,
  ],
  templateUrl: './settings-users-page.component.html',
  styleUrls: ['./settings-users-page.component.css'],
})
export class SettingsUsersPageComponent {
  private readonly settingsService = inject(SettingsService);

  readonly loading = signal<boolean>(true);
  readonly query = signal<string>('');
  readonly page = signal<number>(1);
  readonly pageSize = 10;

  readonly users = signal<UserModel[]>([]);
  readonly selectedUser = signal<UserModel | null>(null);
  readonly showModal = signal<boolean>(false);

  readonly filteredUsers = computed(() => {
    const q = this.query().toLowerCase().trim();
    const list = this.users();

    if (!q) return list;

    return list.filter((u) => {
      const name = u.name?.toLowerCase() ?? '';
      const email = u.email?.toLowerCase() ?? '';
      const role = u.roleKey.toString().toLowerCase();
      return name.includes(q) || email.includes(q) || role.includes(q);
    });
  });

  readonly paginatedUsers = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filteredUsers().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredUsers().length / this.pageSize)),
  );

  readonly totalActive = computed(
    () => this.users().filter((u) => u.isActive).length,
  );

  readonly totalAdmins = computed(
    () => this.users().filter((u) => u.roleKey === UserRole.ADMIN).length,
  );

  constructor() {
    this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      const data = await this.settingsService.getUsers();
      this.users.set(data);
    } finally {
      this.loading.set(false);
    }
  }

  onSearchChange(value: string): void {
    this.query.set(value);
    this.page.set(1);
  }

  onPageChange(page: number): void {
    this.page.set(page);
  }

  openCreate(): void {
    this.selectedUser.set(null);
    this.showModal.set(true);
  }

  openEdit(user: UserModel): void {
    this.selectedUser.set(user);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  async onFormSaved(user: UserModel): Promise<void> {
    if (user.id) {
      await this.settingsService.updateUser(user);
    } else {
      await this.settingsService.createUser({
        name: user.name,
        email: user.email,
        role: user.roleKey,
        isActive: user.isActive,
        avatarUrl: user.avatarUrl,
      });
    }
    await this.load();
    this.closeModal();
  }

  async toggleActive(user: UserModel): Promise<void> {
    await this.settingsService.toggleUserActive(user.id);
    await this.load();
  }
}
