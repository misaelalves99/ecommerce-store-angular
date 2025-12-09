// src/app/core/models/role.model.ts

import { BaseEntity } from './base-entity.model';
import { UserRole } from '../enums/user-role.enum';

export interface RoleProps {
  id: string;
  key: UserRole;         // identificador semântico (ADMIN, MANAGER, ...)
  name?: string;         // nome exibido (ex: "Administrador")
  description?: string;
  permissions?: string[]; // ex: ['orders.read', 'orders.write']
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

/**
 * Role de usuário (Admin, Manager, Operator, Viewer, etc.).
 *
 * - Agrega permissões semânticas para RBAC.
 * - Facilita checks de autorização centralizados no domínio.
 * - Unifica os dois modelos anteriores (props + fábrica createDefaultRole).
 */
export class Role extends BaseEntity<string> {
  private _key: UserRole;
  private _name: string;
  private _description: string;
  private _permissions: string[];

  constructor(props: RoleProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      deletedAt: props.deletedAt ?? null,
    });

    this._key = props.key;
    this._name = props.name ?? Role.defaultNameForKey(props.key);
    this._description = props.description ?? '';
    this._permissions = props.permissions ?? [];
  }

  // ===== Getters =====

  get key(): UserRole {
    return this._key;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get permissions(): string[] {
    return [...this._permissions];
  }

  // ===== Mutação / regras =====

  set name(value: string) {
    this._name = value;
    this.touch();
  }

  set description(value: string) {
    this._description = value;
    this.touch();
  }

  hasPermission(permission: string): boolean {
    return this._permissions.includes(permission);
  }

  addPermission(permission: string): void {
    if (!this._permissions.includes(permission)) {
      this._permissions.push(permission);
      this.touch();
    }
  }

  removePermission(permission: string): void {
    const index = this._permissions.indexOf(permission);
    if (index !== -1) {
      this._permissions.splice(index, 1);
      this.touch();
    }
  }

  override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      key: this._key,
      name: this._name,
      description: this._description,
      permissions: this._permissions,
    };
  }

  // ===== Fábrica de roles padrão =====

  private static defaultNameForKey(key: UserRole): string {
    switch (key) {
      case UserRole.ADMIN:
        return 'Administrador';
      case UserRole.MANAGER:
        return 'Gerente';
      case UserRole.OPERATOR:
        return 'Operador';
      case UserRole.VIEWER:
      default:
        return 'Visualizador';
    }
  }

  /**
   * Fábrica rápida para papéis comuns do painel administrativo.
   * Id deve ser informado pelo chamador (ex: serviço de seed).
   */
  static createDefaultRole(key: UserRole, id: string): Role {
    switch (key) {
      case UserRole.ADMIN:
        return new Role({
          id,
          key,
          name: 'Administrador',
          description:
            'Acesso total ao painel: catálogo, pedidos, clientes, marketing, estoque e configurações.',
          permissions: [
            'catalog:read',
            'catalog:write',
            'orders:read',
            'orders:write',
            'customers:read',
            'customers:write',
            'marketing:read',
            'marketing:write',
            'inventory:read',
            'inventory:write',
            'settings:read',
            'settings:write',
          ],
        });

      case UserRole.MANAGER:
        return new Role({
          id,
          key,
          name: 'Gerente',
          description:
            'Gerencia catálogo, pedidos e clientes, com acesso limitado às configurações.',
          permissions: [
            'catalog:read',
            'catalog:write',
            'orders:read',
            'orders:write',
            'customers:read',
            'customers:write',
            'marketing:read',
            'inventory:read',
            'inventory:write',
            'settings:read',
          ],
        });

      case UserRole.OPERATOR:
        return new Role({
          id,
          key,
          name: 'Operador',
          description:
            'Focado na operação diária: separar pedidos, atualizar status e visualizar clientes.',
          permissions: [
            'orders:read',
            'orders:write',
            'customers:read',
            'inventory:read',
          ],
        });

      case UserRole.VIEWER:
      default:
        return new Role({
          id,
          key: UserRole.VIEWER,
          name: 'Visualizador',
          description:
            'Acesso apenas de leitura para acompanhar métricas e cadastros.',
          permissions: [
            'catalog:read',
            'orders:read',
            'customers:read',
            'marketing:read',
            'inventory:read',
            'settings:read',
          ],
        });
    }
  }
}
