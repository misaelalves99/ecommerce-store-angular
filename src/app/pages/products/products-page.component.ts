// src/app/pages/products/products-page.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../types/product.model';
import { ProductService } from '../../services/product.service';
import { ProductListComponent } from '../../components/product/product-list.component';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [ProductListComponent],
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.css'],
})
export class ProductsPageComponent implements OnInit {
  products: Product[] = [];

  constructor(private router: Router, private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
    });
  }

  handleEdit(id: number) {
    this.router.navigate([`/products/edit/${id}`]);
  }

  handleDelete(id: number) {
    this.router.navigate([`/products/delete/${id}`]);
  }

  handleDetails(id: number) {
    this.router.navigate([`/products/details/${id}`]);
  }

  navigateToCreate() {
    this.router.navigate(['/products/create']);
  }
}
