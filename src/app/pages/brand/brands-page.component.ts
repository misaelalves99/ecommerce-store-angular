// src/app/pages/brands/brands-page.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrandListComponent } from '../../components/brands/brand-list.component';
import { Brand } from '../../types/brand.model';
import { BrandService } from '../../services/brand.service';

@Component({
  selector: 'app-brands-page',
  standalone: true,
  imports: [CommonModule, RouterModule, BrandListComponent],
  templateUrl: './brands-page.component.html',
  styleUrls: ['./brands-page.component.css']
})
export class BrandsPageComponent implements OnInit {
  brands: Brand[] = [];

  constructor(private brandService: BrandService) {}

  ngOnInit(): void {
    this.brands = this.brandService.getBrands();
  }
}
