// src/app/app.routes.spec.ts

import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { routes } from './app.routes';

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

describe('App Routes', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
    });
    router = TestBed.inject(Router);
  });

  // 🔹 Home
  it('should have a route for home', () => {
    const route = routes.find(r => r.path === '');
    expect(route).toBeTruthy();
    expect(route!.component).toBe(HomePageComponent);
  });

  // 🔹 Products
  it('should have a route for products list', () => {
    const route = routes.find(r => r.path === 'products');
    expect(route).toBeTruthy();
    expect(route!.component).toBe(ProductsPageComponent);
  });

  it('should have a route for creating a product', () => {
    const route = routes.find(r => r.path === 'products/create');
    expect(route).toBeTruthy();
    expect(route!.component).toBe(CreateProductPageComponent);
  });

  it('should have a route for editing a product', () => {
    const route = routes.find(r => r.path === 'products/edit/:id');
    expect(route).toBeTruthy();
    expect(route!.component).toBe(EditProductPageComponent);
  });

  it('should have a route for product details', () => {
    const route = routes.find(r => r.path === 'products/details/:id');
    expect(route).toBeTruthy();
    expect(route!.component).toBe(DetailsProductPageComponent);
  });

  // 🔹 Brands
  it('should have a route for brands list', () => {
    const route = routes.find(r => r.path === 'brands');
    expect(route).toBeTruthy();
    expect(route!.component).toBe(BrandsPageComponent);
  });

  it('should have a route for creating a brand', () => {
    const route = routes.find(r => r.path === 'brands/create');
    expect(route).toBeTruthy();
    expect(route!.component).toBe(CreateBrandPageComponent);
  });

  it('should have a route for editing a brand', () => {
    const route = routes.find(r => r.path === 'brands/edit/:id');
    expect(route).toBeTruthy();
    expect(route!.component).toBe(EditBrandPageComponent);
  });

  it('should have a route for brand details', () => {
    const route = routes.find(r => r.path === 'brands/details/:id');
    expect(route).toBeTruthy();
    expect(route!.component).toBe(DetailsBrandPageComponent);
  });

  // 🔹 Categories
  it('should have a route for categories list', () => {
    const route = routes.find(r => r.path === 'categories');
    expect(route).toBeTruthy();
    expect(route!.component).toBe(CategoryPageComponent);
  });

  it('should have a route for creating a category', () => {
    const route = routes.find(r => r.path === 'categories/create');
    expect(route).toBeTruthy();
    expect(route!.component).toBe(CreateCategoryPageComponent);
  });

  it('should have a route for editing a category', () => {
    const route = routes.find(r => r.path === 'categories/edit/:id');
    expect(route).toBeTruthy();
    expect(route!.component).toBe(EditCategoryPageComponent);
  });

  it('should have a route for category details', () => {
    const route = routes.find(r => r.path === 'categories/details/:id');
    expect(route).toBeTruthy();
    expect(route!.component).toBe(DetailsCategoryPageComponent);
  });
});
