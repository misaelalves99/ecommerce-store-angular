// src/app/pages/brands/delete/delete-brand-page.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BrandService } from '../../../services/brand.service';
import { Brand } from '../../../types/brand.model';

@Component({
  selector: 'app-delete-brand-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-brand-page.component.html',
  styleUrls: ['./delete-brand-page.component.css'],
})
export class DeleteBrandPageComponent {
  brand: Brand | undefined;

  constructor(private brandService: BrandService, private router: Router) {
    const url = window.location.pathname;
    const idStr = url.split('/').pop();
    const id = idStr ? Number(idStr) : 0;

    this.brand = this.brandService.getBrands().find((b) => b.id === id);

    if (!this.brand) {
      alert('Marca não encontrada.');
      this.router.navigate(['/brands']);
    }
  }

  handleDelete() {
    if (this.brand) {
      const confirmed = confirm(`Deseja realmente deletar a marca "${this.brand.name}"?`);
      if (confirmed) {
        this.brandService.deleteBrand(this.brand.id);
        this.router.navigate(['/brands']);
      }
    }
  }

  handleCancel() {
    this.router.navigate(['/brands']);
  }
}
