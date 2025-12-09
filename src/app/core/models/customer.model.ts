// src/app/core/models/customer.model.ts

import { BaseEntity } from './base-entity.model';
import { Address } from './address.model';

export interface CustomerProps {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  document?: string | null;          // CPF/CNPJ
  phone?: string | null;
  active?: boolean;                  // status principal
  isActive?: boolean;                // alias compatível
  addresses?: Address[];
  defaultAddressId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

/**
 * Cliente do e-commerce (consumidor final / usado em pedidos, carrinho, relatórios).
 *
 * - Encapsula dados de contato/documento.
 * - Gerencia lista de endereços (ex: cobrança, entrega).
 * - Mantém um endereço padrão (defaultAddressId).
 */
export class Customer extends BaseEntity<string> {
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _document: string | null;
  private _phone: string | null;
  private _addresses: Address[];
  private _active: boolean;
  private _defaultAddressId: string | null;

  constructor(props: CustomerProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      deletedAt: props.deletedAt ?? null,
    });

    this._firstName = props.firstName.trim();
    this._lastName = props.lastName.trim();
    this._email = props.email.trim().toLowerCase();
    this._document = props.document?.trim() ?? null;
    this._phone = props.phone?.trim() ?? null;
    this._addresses = props.addresses ? [...props.addresses] : [];
    this._active = props.active ?? props.isActive ?? true;

    // defaultAddressId: se não vier, tenta usar um dos endereços
    if (props.defaultAddressId) {
      this._defaultAddressId = props.defaultAddressId;
    } else if (this._addresses.length > 0) {
      const defaultFromAddress = this._addresses.find((a: any) => a.isDefault);
      this._defaultAddressId = (defaultFromAddress ?? this._addresses[0]).id ?? null;
    } else {
      this._defaultAddressId = null;
    }
  }

  // ===== Getters =====

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get fullName(): string {
    return `${this._firstName} ${this._lastName}`.trim();
  }

  get email(): string {
    return this._email;
  }

  get document(): string | null {
    return this._document;
  }

  get phone(): string | null {
    return this._phone;
  }

  get addresses(): Address[] {
    return [...this._addresses];
  }

  get active(): boolean {
    return this._active;
  }

  /** Alias de leitura para compatibilidade */
  get isActive(): boolean {
    return this._active;
  }

  get defaultAddressId(): string | null {
    return this._defaultAddressId;
  }

  get defaultAddress(): Address | undefined {
    if (!this._defaultAddressId) return undefined;
    return this._addresses.find((a) => a.id === this._defaultAddressId);
  }

  // ===== Atualizações =====

  set firstName(value: string) {
    this._firstName = value.trim();
    this.touch();
  }

  set lastName(value: string) {
    this._lastName = value.trim();
    this.touch();
  }

  set email(value: string) {
    this._email = value.trim().toLowerCase();
    this.touch();
  }

  set document(value: string | null) {
    this._document = value?.trim() ?? null;
    this.touch();
  }

  set phone(value: string | null) {
    this._phone = value?.trim() ?? null;
    this.touch();
  }

  updateProfile(params: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string | null;
    document?: string | null;
  }): void {
    let changed = false;

    if (params.firstName && params.firstName.trim() !== this._firstName) {
      this._firstName = params.firstName.trim();
      changed = true;
    }

    if (params.lastName && params.lastName.trim() !== this._lastName) {
      this._lastName = params.lastName.trim();
      changed = true;
    }

    if (params.email && params.email.trim().toLowerCase() !== this._email) {
      this._email = params.email.trim().toLowerCase();
      changed = true;
    }

    if (typeof params.phone !== 'undefined') {
      this._phone = params.phone?.trim() ?? null;
      changed = true;
    }

    if (typeof params.document !== 'undefined') {
      this._document = params.document?.trim() ?? null;
      changed = true;
    }

    if (changed) {
      this.touch();
    }
  }

  setActive(active: boolean): void {
    if (this._active !== active) {
      this._active = active;
      this.touch();
    }
  }

  activate(): void {
    this.setActive(true);
  }

  deactivate(): void {
    this.setActive(false);
  }

  // ===== Endereços =====

  addAddress(address: Address): void {
    this._addresses.push(address);

    // Se não houver default, define esse como padrão
    if (!this._defaultAddressId) {
      this._defaultAddressId = address.id;
    }

    this.touch();
  }

  removeAddress(addressId: string): void {
    const existed = this._addresses.some((a) => a.id === addressId);
    if (!existed) return;

    this._addresses = this._addresses.filter((a) => a.id !== addressId);

    if (this._defaultAddressId === addressId) {
      this._defaultAddressId = this._addresses[0]?.id ?? null;
    }

    this.touch();
  }

  /**
   * Atualiza um endereço usando uma função de transformação.
   * Você pode aplicar lógica mais sofisticada no updater (ex: markAsDefault).
   */
  updateAddress(addressId: string, updater: (current: Address) => Address): void {
    const index = this._addresses.findIndex((addr) => addr.id === addressId);
    if (index === -1) return;

    this._addresses[index] = updater(this._addresses[index]);
    this.touch();
  }

  /**
   * Marca um endereço específico como principal.
   * Integra com Address.isDefault/markAsDefault quando disponível.
   */
  setDefaultAddress(addressId: string): void {
    const exists = this._addresses.some((a) => a.id === addressId);
    if (!exists) {
      throw new Error('Default address must exist in customer address list.');
    }

    this._defaultAddressId = addressId;

    // Se Address tiver comportamento próprio de default, respeita:
    this._addresses = this._addresses.map((addr) => {
      const anyAddr = addr as any;

      if (addr.id === addressId) {
        if (typeof anyAddr.markAsDefault === 'function') {
          anyAddr.markAsDefault();
          return anyAddr as Address;
        }
        (anyAddr.isDefault as boolean | undefined) = true;
        return anyAddr as Address;
      }

      if (typeof anyAddr.unmarkAsDefault === 'function') {
        anyAddr.unmarkAsDefault();
        return anyAddr as Address;
      }
      if (typeof anyAddr.isDefault !== 'undefined') {
        anyAddr.isDefault = false;
      }
      return anyAddr as Address;
    });

    this.touch();
  }

  override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      firstName: this._firstName,
      lastName: this._lastName,
      fullName: this.fullName,
      email: this._email,
      document: this._document,
      phone: this._phone,
      active: this._active,
      isActive: this._active,
      addresses: this._addresses.map((addr: any) =>
        typeof addr.toJSON === 'function' ? addr.toJSON() : addr
      ),
      defaultAddressId: this._defaultAddressId,
    };
  }
}
