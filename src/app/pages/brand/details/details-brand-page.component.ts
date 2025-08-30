// src/app/pages/brands/details/details-brand-page.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BrandDetailsComponent } from '../../../components/brands/brand-details.component';
import { Brand } from '../../../types/brand.model';
import { BrandService } from '../../../services/brand.service';

@Component({
  selector: 'app-details-brand-page',
  standalone: true,
  imports: [CommonModule, RouterModule, BrandDetailsComponent],
  templateUrl: './details-brand-page.component.html',
  styleUrls: ['./details-brand-page.component.css'],
})
export class DetailsBrandPageComponent implements OnInit {
  brand: Brand | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private brandService: BrandService) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const foundBrand = this.brandService.getBrands().find(b => b.id === Number(idParam));
      if (foundBrand) {
        this.brand = foundBrand;
      } else {
        alert('Marca não encontrada.');
        this.router.navigate(['/brands']);
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/brands']);
  }

  goToEdit(): void {
    if (this.brand) {
      this.router.navigate(['/brands/edit', this.brand.id]);
    }
  }
}
