// src/app/pages/brands/create/create-brand-page.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BrandService } from '../../../services/brand.service';
import { BrandFormComponent } from '../../../components/brands/brand-form.component';

@Component({
  selector: 'app-create-brand-page',
  standalone: true,
  imports: [BrandFormComponent],
  templateUrl: './create-brand-page.component.html',
  styleUrls: ['./create-brand-page.component.css'],
})
export class CreateBrandPageComponent {
  constructor(private router: Router, private brandService: BrandService) {}

  // Recebe diretamente a string emitida pelo form
  handleCreate(name: string) {
    this.brandService.addBrand(name);  // Passa o nome direto para o service
    this.router.navigate(['/brands']);
  }

  handleCancel() {
    this.router.navigate(['/brands']);
  }
}
