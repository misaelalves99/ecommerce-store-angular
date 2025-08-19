// src/app/types/product.model.ts
import { Brand } from './brand.model';
import { Category } from './category.model';

export interface Product {
  id: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  stock: number;
  categoryId: number;
  brandId: number;
  isActive: boolean;
  category?: Category;
  brand?: Brand;
}
