// src/app/app.routes.ts
import { Routes } from '@angular/router';

// Pages
import { HomePageComponent } from './pages/home/home-page.component';
import { ProductsPageComponent } from './pages/products/products-page.component';
import { CreateProductPageComponent } from './pages/products/create/create-product-page.component';
import { EditProductPageComponent } from './pages/products/edit/edit-product-page.component';
import { DetailsProductPageComponent } from './pages/products/details/details-product-page.component';
import { BrandsPageComponent } from './pages/brand/brands-page.component';
import { CreateBrandPageComponent } from './pages/brand/create/create-brand-page.component';
import { EditBrandPageComponent } from './pages/brand/edit/edit-brand-page.component';
import { DetailsBrandPageComponent } from './pages/brand/details/details-brand-page.component';
import { CategoryPageComponent } from './pages/category/category-page.component';
import { CreateCategoryPageComponent } from './pages/category/create/create-category-page.component';
import { EditCategoryPageComponent } from './pages/category/edit/edit-category-page.component';
import { DetailsCategoryPageComponent } from './pages/category/details/details-category-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },

  // Products
  { path: 'products', component: ProductsPageComponent },
  { path: 'products/create', component: CreateProductPageComponent },
  { path: 'products/edit/:id', component: EditProductPageComponent },
  { path: 'products/details/:id', component: DetailsProductPageComponent },

  // Brands
  { path: 'brands', component: BrandsPageComponent },
  { path: 'brands/create', component: CreateBrandPageComponent },
  { path: 'brands/edit/:id', component: EditBrandPageComponent },
  { path: 'brands/details/:id', component: DetailsBrandPageComponent },

  // Categories
  { path: 'categories', component: CategoryPageComponent },
  { path: 'categories/create', component: CreateCategoryPageComponent },
  { path: 'categories/edit/:id', component: EditCategoryPageComponent },
  { path: 'categories/details/:id', component: DetailsCategoryPageComponent },
];
