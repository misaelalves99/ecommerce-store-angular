// src/app/components/brand/brand-details.component.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import './brand-details.component.css';

export interface Brand {
  id: number;
  name: string;
}

@Component({
  selector: 'app-brand-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brand-details.component.html',
  styleUrls: ['./brand-details.component.css']
})
export class BrandDetailsComponent {
  @Input() brand!: Brand;
}
