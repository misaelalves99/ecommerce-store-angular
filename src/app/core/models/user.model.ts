// src/app/core/models/user.model.ts

import { BaseEntity } from './base-entity.model';
import { Role } from './role.model';
import { UserRole } from '../enums/user-role.enum';

export interface UserProps {
  id?: string;

  /** Nome do usuário – pode vir como name ou displayName */
  name?: string;
  displayName?: string;

  email: string;

  /** Nunca trafegar senha pura – só hash se precisar */
  passwordHash?: string;

  /** Nome canônico do avatar */
  avatarUrl?: string | null;

  /** Alias legado usado em alguns lugares antigos */
  photoUrl?: string | null;

  /** Flags de ativo/inativo (canônica: isActive) */
  active?: boolean;
  isActive?: boolean;

  /** Papel do usuário – pode ser Role ou o enum UserRole */
  role: Role | UserRole;

  /** E-mail verificado (compatível com Firebase) */
  emailVerified?: boolean;

  /** Datas de auditoria/autenticação */
  lastLoginAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

/**
 * Entidade de usuário do painel administrativo.
 *
 * Unifica:
 * - User antigo (name/displayName, photoUrl, active)
 * - RBAC com Role / UserRole
 * - helpers para isAdmin/isManager/etc
 */
export class UserModel extends BaseEntity<string> {
  private _name: string;
  private _email: string;

  private _passwordHash: string | null;

  private _avatarUrl: string | null;
  private _isActive: boolean;

  private _role: Role;
  private _lastLoginAt: Date | null;

  private _emailVerified: boolean;

  constructor(props: UserProps) {
    const id = props.id ?? crypto.randomUUID();

    super({
      id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      deletedAt: props.deletedAt ?? null,
    });

    const rawName = props.name ?? props.displayName ?? '';
    this._name = rawName.trim();
    this._email = props.email.toLowerCase();

    this._passwordHash = props.passwordHash ?? null;

    this._avatarUrl = props.avatarUrl ?? props.photoUrl ?? null;
    this._isActive = props.isActive ?? props.active ?? true;

    const roleInput = props.role;
    this._role =
      roleInput instanceof Role
        ? roleInput
        : Role.createDefaultRole(roleInput, crypto.randomUUID());

    this._lastLoginAt = props.lastLoginAt ?? null;
    this._emailVerified = props.emailVerified ?? false;
  }

  // ===== Getters =====

  get name(): string {
    return this._name;
  }

  /** Alias compatível com displayName */
  get displayName(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  /** Nome canônico do avatar */
  get avatarUrl(): string | null {
    return this._avatarUrl;
  }

  /** Alias compatível com photoUrl do modelo antigo */
  get photoUrl(): string | null {
    return this._avatarUrl;
  }

  /** Flag canônica de ativo */
  get isActive(): boolean {
    return this._isActive;
  }

  /** Alias compatível com active do modelo antigo */
  get active(): boolean {
    return this._isActive;
  }

  get role(): Role {
    return this._role;
  }

  get lastLoginAt(): Date | null {
    return this._lastLoginAt;
  }

  get emailVerified(): boolean {
    return this._emailVerified;
  }

  /** Atalho para o enum do papel (ADMIN, MANAGER, etc.) */
  get roleKey(): UserRole {
    return this._role.key;
  }

  // ===== Mutação / regras =====

  set name(value: string) {
    this._name = value.trim();
    this.touch();
  }

  /** Mantém compat com displayName */
  set displayName(value: string) {
    this.name = value;
  }

  set avatarUrl(value: string | null) {
    this._avatarUrl = value;
    this.touch();
  }

  /** Alias de conveniência (mantém compatibilidade) */
  set photoUrl(value: string | null) {
    this.avatarUrl = value;
  }

  /**
   * Atualiza dados básicos do usuário.
   * Compatível com updateProfile(name, avatarUrl?) do modelo antigo.
   */
  updateProfile(name: string, avatarUrl?: string | null): void {
    this._name = name.trim();
    if (typeof avatarUrl !== 'undefined') {
      this._avatarUrl = avatarUrl;
    }
    this.touch();
  }

  /**
   * Ativa ou desativa o usuário (API canônica).
   */
  setActive(active: boolean): void {
    this._isActive = active;
    this.touch();
  }

  /** Alias convenientes para domínios que usam activate/deactivate */
  activate(): void {
    if (!this._isActive) {
      this._isActive = true;
      this.touch();
    }
  }

  deactivate(): void {
    if (this._isActive) {
      this._isActive = false;
      this.touch();
    }
  }

  /**
   * Troca a role do usuário.
   * Aceita tanto Role quanto UserRole (enum).
   */
  changeRole(role: Role | UserRole): void {
    this._role =
      role instanceof Role
        ? role
        : Role.createDefaultRole(role, crypto.randomUUID());
    this.touch();
  }

  /**
   * Registra data/hora do último login bem-sucedido.
   * Compatível com markLogin() e updateLastLogin().
   */
  markLogin(date: Date = new Date()): void {
    this._lastLoginAt = date;
    this.touch();
  }

  /** Alias compatível com updateLastLogin(date?) */
  updateLastLogin(date: Date = new Date()): void {
    this.markLogin(date);
  }

  /**
   * Atualiza hash de senha.
   * (Você decide em qual camada chamar isso – nunca trafegar senha pura aqui).
   */
  setPasswordHash(hash: string | null): void {
    this._passwordHash = hash;
    this.touch();
  }

  setEmailVerified(value: boolean): void {
    this._emailVerified = value;
    this.touch();
  }

  /**
   * Verifica se o usuário possui determinada permissão (RBAC).
   */
  hasPermission(permission: string): boolean {
    return this._role.hasPermission(permission);
  }

  // ===== Atalhos para RBAC (úteis na camada de apresentação) =====

  isAdmin(): boolean {
    return this.roleKey === UserRole.ADMIN;
  }

  isManager(): boolean {
    return this.roleKey === UserRole.MANAGER;
  }

  isOperator(): boolean {
    return this.roleKey === UserRole.OPERATOR;
  }

  isViewer(): boolean {
    return this.roleKey === UserRole.VIEWER;
  }

  // ===== Serialização =====

  override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      name: this._name,
      displayName: this._name, // compat com modelo antigo
      email: this._email,
      avatarUrl: this._avatarUrl,
      photoUrl: this._avatarUrl, // compatibilidade
      isActive: this._isActive,
      active: this._isActive, // compatibilidade
      lastLoginAt: this._lastLoginAt ? this._lastLoginAt.toISOString() : null,
      role: this._role.key, // persistimos apenas a chave enum
      emailVerified: this._emailVerified,
      // passwordHash propositalmente NÃO é serializado por segurança
    };
  }
}

/**
 * Alias para manter compatibilidade com código/specs antigos
 * que importam `User` de '../models/user.model'.
 */
export type User = UserModel;
