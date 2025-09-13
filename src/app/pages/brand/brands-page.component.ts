// src/app/pages/brands/brands-page.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
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
export class BrandsPageComponent {
  brands$: Observable<Brand[]>;

  constructor(
    private router: Router,
    private brandService: BrandService
  ) {
    this.brands$ = this.brandService.getBrands();
  }

  navigateToCreate() {
    this.router.navigate(['/brands/create']);
  }

  handleDelete(id: number) {
    // Mantém o estado sincronizado via serviço
    this.brandService.deleteBrand(id);
  }
}
