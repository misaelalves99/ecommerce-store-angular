// src/app/features/customers/components/customer-address-list/customer-address-list.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Address } from '../../../../core/models/address.model';

@Component({
  standalone: true,
  selector: 'app-customer-address-list',
  imports: [CommonModule],
  templateUrl: './customer-address-list.component.html',
  styleUrls: ['./customer-address-list.component.css'],
})
export class CustomerAddressListComponent {
  @Input() addresses: Address[] = [];

  trackByAddressId = (_: number, address: Address) => address.id;
}
