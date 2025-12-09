// src/app/core/models/address.model.ts

import { BaseEntity } from './base-entity.model';

export interface AddressProps {
  id: string;
  label?: string;          // Ex: "Casa", "Trabalho"
  street: string;
  number: string;
  complement?: string;
  district?: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  isDefault?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

/**
 * Endereço do cliente/loja.
 *
 * Pode ser usado como:
 * - endereço de entrega
 * - endereço de cobrança
 * - endereço principal do cliente
 */
export class Address extends BaseEntity<string> {
  private _label: string | null;
  private _street: string;
  private _number: string;
  private _complement: string | null;
  private _district: string | null;
  private _city: string;
  private _state: string;
  private _zipCode: string;
  private _country: string;
  private _isDefault: boolean;

  constructor(props: AddressProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      deletedAt: props.deletedAt ?? null,
    });

    this._label = props.label?.trim() ?? null;
    this._street = props.street.trim();
    this._number = props.number.trim();
    this._complement = props.complement?.trim() ?? null;
    this._district = props.district?.trim() ?? null;
    this._city = props.city.trim();
    this._state = props.state.trim();
    this._zipCode = props.zipCode.trim();
    this._country = props.country?.trim() || 'Brasil';
    this._isDefault = props.isDefault ?? false;
  }

  // ===== Getters =====

  get label(): string | null {
    return this._label;
  }

  get street(): string {
    return this._street;
  }

  get number(): string {
    return this._number;
  }

  get complement(): string | null {
    return this._complement;
  }

  get district(): string | null {
    return this._district;
  }

  get city(): string {
    return this._city;
  }

  get state(): string {
    return this._state;
  }

  get zipCode(): string {
    return this._zipCode;
  }

  get country(): string {
    return this._country;
  }

  get isDefault(): boolean {
    return this._isDefault;
  }

  /**
   * Endereço completo em uma string amigável para exibição.
   * Ex: "Rua X, 123 • Apto 10 • Centro • São Paulo - SP • 01000-000 • Brasil"
   */
  get fullAddress(): string {
    const parts = [
      `${this._street}, ${this._number}`,
      this._complement || undefined,
      this._district || undefined,
      `${this._city} - ${this._state}`,
      this._zipCode,
      this._country,
    ].filter(Boolean);

    return parts.join(' • ');
  }

  // ===== Setters (mutação controlada) =====

  set label(value: string | null) {
    this._label = value?.trim() ?? null;
    this.touch();
  }

  set street(value: string) {
    this._street = value.trim();
    this.touch();
  }

  set number(value: string) {
    this._number = value.trim();
    this.touch();
  }

  set complement(value: string | null) {
    this._complement = value?.trim() ?? null;
    this.touch();
  }

  set district(value: string | null) {
    this._district = value?.trim() ?? null;
    this.touch();
  }

  set city(value: string) {
    this._city = value.trim();
    this.touch();
  }

  set state(value: string) {
    this._state = value.trim();
    this.touch();
  }

  set zipCode(value: string) {
    this._zipCode = value.trim();
    this.touch();
  }

  set country(value: string) {
    this._country = value.trim();
    this.touch();
  }

  // ===== Regras de domínio =====

  markAsDefault(): void {
    if (!this._isDefault) {
      this._isDefault = true;
      this.touch();
    }
  }

  unmarkAsDefault(): void {
    if (this._isDefault) {
      this._isDefault = false;
      this.touch();
    }
  }

  /**
   * Atualização em lote, usando as mesmas regras de trim e touch().
   */
  update(params: {
    label?: string | null;
    street?: string;
    number?: string;
    complement?: string | null;
    district?: string | null;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    isDefault?: boolean;
  }): void {
    if ('label' in params) this.label = params.label ?? null;
    if ('street' in params && params.street) this.street = params.street;
    if ('number' in params && params.number) this.number = params.number;
    if ('complement' in params) this.complement = params.complement ?? null;
    if ('district' in params) this.district = params.district ?? null;
    if ('city' in params && params.city) this.city = params.city;
    if ('state' in params && params.state) this.state = params.state;
    if ('zipCode' in params && params.zipCode) this.zipCode = params.zipCode;
    if ('country' in params && params.country) this.country = params.country;
    if ('isDefault' in params && typeof params.isDefault === 'boolean') {
      this._isDefault = params.isDefault;
      this.touch();
    }
  }

  override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      label: this._label,
      street: this._street,
      number: this._number,
      complement: this._complement,
      district: this._district,
      city: this._city,
      state: this._state,
      zipCode: this._zipCode,
      country: this._country,
      isDefault: this._isDefault,
      fullAddress: this.fullAddress,
    };
  }
}
