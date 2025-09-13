// src/app/pages/brands/delete/delete-brand-page.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService } from '../../../services/brand.service';
import { Brand } from '../../../types/brand.model';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-delete-brand-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-brand-page.component.html',
  styleUrls: ['./delete-brand-page.component.css'],
})
export class DeleteBrandPageComponent {
  brand$: Observable<Brand | undefined>;
  private brandId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private brandService: BrandService
  ) {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.brand$ = of(undefined);
      this.router.navigate(['/brands']);
      return;
    }

    this.brandId = +idParam;

    this.brand$ = this.brandService.getBrands().pipe(
      map((brands) => brands.find((b) => b.id === this.brandId))
    );
  }

  handleDelete() {
    if (!this.brandId) return;
    this.brandService.deleteBrand(this.brandId);
    this.router.navigate(['/brands']);
  }

  handleCancel() {
    this.router.navigate(['/brands']);
  }
}
