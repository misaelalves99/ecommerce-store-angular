// src/app/pages/brands/create/create-brand-page.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BrandFormComponent } from '../../../components/brands/brand-form.component';
import { BrandService } from '../../../services/brand.service';

@Component({
  selector: 'app-create-brand-page',
  standalone: true,
  imports: [CommonModule, BrandFormComponent],
  templateUrl: './create-brand-page.component.html',
})
export class CreateBrandPageComponent {
  constructor(private brandService: BrandService, private router: Router) {}

  handleCreate(name: string) {
    this.brandService.addBrand(name);
    this.router.navigate(['/brands']);
  }

  handleCancel() {
    this.router.navigate(['/brands']);
  }
}
