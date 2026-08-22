import { Injectable } from '@angular/core';
import { PRODUCTS } from './product.data';
import { Product } from './product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  getProducts(): Product[] {
    return PRODUCTS;
  }

  getProduct(id: number): Product | undefined {
    return PRODUCTS.find((product) => product.id === id);
  }

  getCategories(): string[] {
    return ['All', ...new Set(PRODUCTS.map((product) => product.category))];
  }
}
