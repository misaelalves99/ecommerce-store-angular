// src/app/core/models/audit-log.model.ts

import { BaseEntity } from './base-entity.model';

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'STATUS_CHANGE'
  | 'OTHER';

export interface AuditLogProps {
  id: string;
  userId?: string | null;
  userName?: string | null;
  userEmail?: string | null;

  /**
   * Nome da entidade de domínio impactada.
   * Ex: 'Product', 'Order', 'Customer'
   */
  entityName: string;
  entityId?: string | null;

  action: AuditAction;
  description?: string | null;

  ipAddress?: string | null;
  userAgent?: string | null;

  /**
   * Campo flexível para registrar dados adicionais relevantes
   * (payload antigo/novo, contexto da requisição, etc.).
   */
  metadata?: Record<string, unknown> | null;

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

/**
 * Registro de auditoria do sistema.
 *
 * Serve para:
 * - Rastrear operações críticas (CRUD de pedidos, produtos, etc.).
 * - Apoiar investigações e compliance (quem fez o quê, quando e de onde).
 */
export class AuditLog extends BaseEntity<string> {
  private _userId: string | null;
  private _userName: string | null;
  private _userEmail: string | null;

  private _entityName: string;
  private _entityId: string | null;

  private _action: AuditAction;
  private _description: string | null;

  private _ipAddress: string | null;
  private _userAgent: string | null;

  private _metadata: Record<string, unknown> | null;

  constructor(props: AuditLogProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      deletedAt: props.deletedAt ?? null,
    });

    this._userId = props.userId ?? null;
    this._userName = props.userName?.trim() ?? null;
    this._userEmail = props.userEmail?.toLowerCase().trim() ?? null;

    this._entityName = props.entityName.trim();
    this._entityId = props.entityId ?? null;

    this._action = props.action;
    this._description = props.description?.trim() ?? null;

    this._ipAddress = props.ipAddress?.trim() ?? null;
    this._userAgent = props.userAgent?.trim() ?? null;

    this._metadata = props.metadata ?? null;
  }

  // ===== Getters =====

  get userId(): string | null {
    return this._userId;
  }

  get userName(): string | null {
    return this._userName;
  }

  get userEmail(): string | null {
    return this._userEmail;
  }

  get entityName(): string {
    return this._entityName;
  }

  /**
   * Alias para compatibilidade com o nome antigo `entityType`.
   */
  get entityType(): string {
    return this._entityName;
  }

  get entityId(): string | null {
    return this._entityId;
  }

  get action(): AuditAction {
    return this._action;
  }

  get description(): string | null {
    return this._description;
  }

  get ipAddress(): string | null {
    return this._ipAddress;
  }

  get userAgent(): string | null {
    return this._userAgent;
  }

  get metadata(): Record<string, unknown> | null {
    return this._metadata ? { ...this._metadata } : null;
  }

  // ===== Mutação controlada =====

  setDescription(description: string | null): void {
    this._description = description?.trim() ?? null;
    this.touch();
  }

  setMetadata(metadata: Record<string, unknown> | null): void {
    this._metadata = metadata ? { ...metadata } : null;
    this.touch();
  }

  /**
   * Faz merge incremental de metadata, preservando o que já existe.
   */
  updateMetadata(metadata: Record<string, unknown>): void {
    this._metadata = {
      ...(this._metadata ?? {}),
      ...metadata,
    };
    this.touch();
  }

  override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      userId: this._userId,
      userName: this._userName,
      userEmail: this._userEmail,
      entityName: this._entityName,
      entityType: this._entityName, // alias de compatibilidade
      entityId: this._entityId,
      action: this._action,
      description: this._description,
      ipAddress: this._ipAddress,
      userAgent: this._userAgent,
      metadata: this._metadata,
    };
  }
}
