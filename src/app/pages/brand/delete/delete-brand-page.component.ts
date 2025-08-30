// src/app/pages/brands/delete/delete-brand-page.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService } from '../../../services/brand.service';
import { Brand } from '../../../types/brand.model';

@Component({
  selector: 'app-delete-brand-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-brand-page.component.html',
  styleUrls: ['./delete-brand-page.component.css'],
})
export class DeleteBrandPageComponent implements OnInit {
  brand?: Brand;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private brandService: BrandService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.brand = this.brandService.getBrands().find(b => b.id === id);

    if (!this.brand) {
      alert('Marca não encontrada.');
      this.router.navigate(['/brands']);
    }
  }

  handleDelete() {
    if (this.brand) {
      this.brandService.deleteBrand(this.brand.id);
      this.router.navigate(['/brands']);
    }
  }

  handleCancel() {
    this.router.navigate(['/brands']);
  }
}
