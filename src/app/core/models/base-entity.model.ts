// src/app/core/models/base-entity.model.ts

/**
 * Classe base para todas as entidades do domínio.
 *
 * - Garante campos comuns: id, createdAt, updatedAt, deletedAt.
 * - Centraliza operações de atualização de data e soft-delete.
 * - Mantém o modelo desacoplado do Angular (apenas TypeScript).
 */
export interface BaseEntityProps<ID = string> {
  id?: ID;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export abstract class BaseEntity<ID = string> {
  private _id: ID;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date | null;

  protected constructor(props?: BaseEntityProps<ID>) {
    const now = new Date();

    this._id = (props?.id ?? (crypto.randomUUID() as ID));
    this._createdAt = props?.createdAt ?? now;
    this._updatedAt = props?.updatedAt ?? this._createdAt;
    this._deletedAt = props?.deletedAt ?? null;
  }

  get id(): ID {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  get isDeleted(): boolean {
    return this._deletedAt !== null;
  }

  /**
   * Atualiza o updatedAt para agora.
   * Deve ser chamado sempre que houver mudança relevante na entidade.
   */
  protected touch(): void {
    this._updatedAt = new Date();
  }

  /**
   * Marca a entidade como soft-deleted (não remove de fato).
   */
  softDelete(): void {
    if (!this._deletedAt) {
      this._deletedAt = new Date();
      this.touch();
    }
  }

  /**
   * Restaura uma entidade marcada como soft-deleted.
   */
  restore(): void {
    if (this._deletedAt) {
      this._deletedAt = null;
      this.touch();
    }
  }

  /**
   * Retorna um objeto plain pronto para serialização/API.
   * Subclasses podem extender usando:
   *   return { ...super.toJSON(), ... }
   */
  toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
      deletedAt: this._deletedAt ? this._deletedAt.toISOString() : null,
    };
  }
}
