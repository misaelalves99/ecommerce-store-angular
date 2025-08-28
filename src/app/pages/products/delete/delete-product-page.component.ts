// src/app/pages/products/delete-product-page.component.ts
// src/app/pages/products/delete-product-page.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../types/product.model';

@Component({
  selector: 'app-delete-product-page',
  standalone: true,
  imports: [CommonModule], // removido RouterLink
  templateUrl: './delete-product-page.component.html',
  styleUrls: ['./delete-product-page.component.css'],
})
export class DeleteProductPageComponent {
  product: Product | undefined;

  constructor(private productService: ProductService, private router: Router) {
    const url = window.location.pathname;
    const idStr = url.split('/').pop();
    const id = idStr ? Number(idStr) : 0;

    this.product = this.productService.getProducts().find(p => p.id === id);

    if (!this.product) {
      alert('Produto não encontrado.');
      this.router.navigate(['/products']);
    }
  }

  handleDelete() {
    if (this.product) {
      const confirmed = confirm(`Deseja realmente deletar o produto "${this.product.name}"?`);
      if (confirmed) {
        this.productService.deleteProduct(this.product.id);
        this.router.navigate(['/products']);
      }
    }
  }

  handleCancel() {
    this.router.navigate(['/products']);
  }
}
