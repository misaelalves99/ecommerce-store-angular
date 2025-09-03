// src/app/pages/brands/edit/edit-brand-page.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Brand } from '../../../types/brand.model';
import { BrandService } from '../../../services/brand.service';
import { BrandFormComponent } from '../../../components/brands/brand-form.component';

@Component({
  selector: 'app-edit-brand-page',
  standalone: true,
  imports: [CommonModule, BrandFormComponent],
  templateUrl: './edit-brand-page.component.html',
  styleUrls: ['./edit-brand-page.component.css']
})
export class EditBrandPageComponent implements OnInit {
  brand: Brand | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private brandService: BrandService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) return;

    const brandId = Number(idParam);

    // Assina o Observable do service
    this.brandService.getBrands().subscribe((brands) => {
      const foundBrand = brands.find(b => b.id === brandId);

      if (foundBrand) {
        this.brand = foundBrand;
      } else {
        alert('Marca não encontrada.');
        this.router.navigate(['/brands']);
      }
    });
  }

  handleUpdate(name: string): void {
    if (!this.brand) return;

    this.brandService.updateBrand(this.brand.id, name);
    this.router.navigate(['/brands']);
  }

  handleCancel(): void {
    this.router.navigate(['/brands']);
  }
}
