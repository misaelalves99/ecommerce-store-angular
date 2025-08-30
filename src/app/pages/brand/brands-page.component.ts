// src/app/pages/brands/brands-page.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Brand } from '../../types/brand.model';
import { BrandService } from '../../services/brand.service';
import { BrandListComponent } from '../../components/brands/brand-list.component';

@Component({
  selector: 'app-brands-page',
  standalone: true,
  imports: [CommonModule, BrandListComponent],
  templateUrl: './brands-page.component.html',
  styleUrls: ['./brands-page.component.css'],
})
export class BrandsPageComponent implements OnInit {
  brands: Brand[] = [];

  constructor(private router: Router, private brandService: BrandService) {}

  ngOnInit(): void {
    this.brands = this.brandService.getBrands();
  }

  navigateToCreate() {
    this.router.navigate(['/brands/create']);
  }

  handleDelete(id: number) {
    // Atualiza a lista local ao navegar para delete
    this.brands = this.brands.filter(b => b.id !== id);
  }
}
