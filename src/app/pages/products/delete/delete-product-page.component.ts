// src/app/pages/products/delete/delete-product-page.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../types/product.model';

@Component({
  selector: 'app-delete-product-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-product-page.component.html',
  styleUrls: ['./delete-product-page.component.css'],
})
export class DeleteProductPageComponent implements OnInit {
  product?: Product;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProducts().subscribe(products => {
      this.product = products.find(p => p.id === id);
    });
  }

  handleDelete() {
    if (this.product) {
      this.productService.deleteProduct(this.product.id);
      this.router.navigate(['/products']);
    }
  }

  handleCancel() {
    this.router.navigate(['/products']);
  }
}
