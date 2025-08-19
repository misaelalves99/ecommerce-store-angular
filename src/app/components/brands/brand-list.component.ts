// src/app/components/brand/brand-list.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface Brand {
  id: number;
  name: string;
}

@Component({
  selector: 'app-brand-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css']
})
export class BrandListComponent {
  @Input() brands: Brand[] = [];

  handleDelete(brand: Brand) {
    alert(`Excluir marca ${brand.name}`);
  }
}
