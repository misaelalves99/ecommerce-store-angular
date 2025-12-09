// src/app/core/services/settings.service.ts

import { Injectable, signal, WritableSignal } from '@angular/core';

import { UserModel, UserProps } from '../models/user.model';
import { UserRole } from '../enums/user-role.enum';
import { StoreSettings } from '../models/store-settings.model';
import { RolePermissions } from '../models/role-permissions.model';

/**
 * Serviço de configurações do painel.
 *
 * Por enquanto ele mantém os dados em memória (mock),
 * mas a assinatura é toda async para no futuro plugar em uma API real.
 */
@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  // ====== USERS ==============================================================

  private readonly _users: WritableSignal<UserModel[]> = signal<UserModel[]>([
    new UserModel({
      id: 'u-1',
      name: 'Admin Master',
      email: 'admin@store.com',
      role: UserRole.ADMIN,
      isActive: true,
    }),
    new UserModel({
      id: 'u-2',
      name: 'Gestor Loja',
      email: 'manager@store.com',
      role: UserRole.MANAGER,
      isActive: true,
    }),
    new UserModel({
      id: 'u-3',
      name: 'Operador Caixa',
      email: 'operator@store.com',
      role: UserRole.OPERATOR,
      isActive: true,
    }),
  ]);

  /**
   * Lista todos os usuários cadastrados nas configurações.
   */
  async getUsers(): Promise<UserModel[]> {
    // retorna cópia rasa para evitar mutação externa
    return this._users().map((u) => u);
  }

  /**
   * Cria um novo usuário.
   */
  async createUser(payload: Partial<UserProps>): Promise<UserModel> {
    const user = new UserModel({
      id: payload.id ?? crypto.randomUUID(),
      name: payload.name ?? payload.displayName ?? 'Novo usuário',
      email: payload.email ?? '',
      role: payload.role ?? UserRole.OPERATOR,
      isActive: payload.isActive ?? true,
      avatarUrl: payload.avatarUrl ?? payload.photoUrl ?? null,
    });

    this._users.update((list) => [...list, user]);
    return user;
  }

  /**
   * Atualiza um usuário existente.
   */
  async updateUser(user: UserModel): Promise<UserModel> {
    this._users.update((list) =>
      list.map((u) => (u.id === user.id ? user : u)),
    );
    return user;
  }

  /**
   * Ativa/desativa um usuário.
   */
  async toggleUserActive(userId: string): Promise<void> {
    this._users.update((list) =>
      list.map((u) => {
        if (u.id !== userId) return u;
        const clone = new UserModel({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          isActive: !u.isActive,
          avatarUrl: u.avatarUrl,
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
          lastLoginAt: u.lastLoginAt,
        });
        return clone;
      }),
    );
  }

  // ====== STORE SETTINGS =====================================================

  private _storeSettings = signal<StoreSettings>({
    name: 'Minha Loja Virtual',
    cnpj: '00.000.000/0001-00',
    email: 'contato@minhaloja.com',
    phone: '+55 (11) 90000-0000',
    timezone: 'America/Sao_Paulo',
    currency: 'BRL',
    addressLine1: 'Rua Exemplo, 123',
    addressLine2: 'Sala 01',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01000-000',
  });

  async getStoreSettings(): Promise<StoreSettings> {
    return { ...this._storeSettings() };
  }

  async updateStoreSettings(value: StoreSettings): Promise<void> {
    this._storeSettings.set({ ...value });
  }

  // ====== ROLE PERMISSIONS ===================================================

  private _rolePermissions = signal<RolePermissions[]>([
    {
      role: UserRole.ADMIN,
      description: 'Administrador (acesso total)',
      permissions: ['*'],
    },
    {
      role: UserRole.MANAGER,
      description: 'Gestor (relatórios, cadastro, pedidos)',
      permissions: ['orders.*', 'catalog.*', 'customers.*'],
    },
    {
      role: UserRole.OPERATOR,
      description: 'Operador (pedidos e atendimento)',
      permissions: ['orders.read', 'orders.update', 'customers.read'],
    },
    {
      role: UserRole.VIEWER,
      description: 'Apenas leitura',
      permissions: ['orders.read', 'catalog.read', 'customers.read'],
    },
  ]);

  async getRolePermissions(): Promise<RolePermissions[]> {
    return this._rolePermissions().map((r) => ({
      role: r.role,
      description: r.description,
      permissions: [...r.permissions],
    }));
  }

  async updateRolePermissions(value: RolePermissions): Promise<void> {
    this._rolePermissions.update((list) => {
      const idx = list.findIndex((r) => r.role === value.role);
      if (idx === -1) {
        return [...list, { ...value, permissions: [...value.permissions] }];
      }
      const copy = [...list];
      copy[idx] = { ...value, permissions: [...value.permissions] };
      return copy;
    });
  }
}
