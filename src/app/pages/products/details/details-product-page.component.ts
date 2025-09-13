// src/app/pages/products/details/details-product-page.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductDetailsComponent } from '../../../components/product/product-details.component';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../types/product.model';

@Component({
  selector: 'app-details-product-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductDetailsComponent],
  templateUrl: './details-product-page.component.html',
  styleUrls: ['./details-product-page.component.css'],
})
export class DetailsProductPageComponent implements OnInit {
  product: Product | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const idParam = Number(this.route.snapshot.paramMap.get('id'));
    if (idParam) {
      this.productService.getProducts().subscribe(products => {
        const foundProduct = products.find(p => p.id === idParam);
        if (foundProduct) {
          this.product = foundProduct;
        } else {
          alert('Produto não encontrado.');
          this.router.navigate(['/products']);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  goToEdit(): void {
    if (this.product) {
      this.router.navigate(['/products/edit', this.product.id]);
    }
  }
}
