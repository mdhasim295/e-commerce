import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../products/product.model';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private static readonly storageKey = 'morrow-wishlist';
  private readonly productsSubject = new BehaviorSubject<Product[]>(
    this.loadProducts(),
  );
  readonly products$ = this.productsSubject.asObservable();

  toggle(product: Product): void {
    const products = this.productsSubject.value;
    const exists = products.some((item) => item.id === product.id);
    this.setProducts(
      exists
        ? products.filter((item) => item.id !== product.id)
        : [...products, product],
    );
  }

  has(productId: number): boolean {
    return this.productsSubject.value.some(
      (product) => product.id === productId,
    );
  }

  getProducts(): Product[] {
    return [...this.productsSubject.value];
  }

  getCount(): number {
    return this.productsSubject.value.length;
  }

  private setProducts(products: Product[]): void {
    this.productsSubject.next(products);
    try {
      window.localStorage.setItem(
        WishlistService.storageKey,
        JSON.stringify(products),
      );
    } catch {}
  }

  private loadProducts(): Product[] {
    try {
      const savedProducts = window.localStorage.getItem(
        WishlistService.storageKey,
      );
      if (!savedProducts) {
        return [];
      }
      const products = JSON.parse(savedProducts) as Product[];
      return Array.isArray(products) ? products : [];
    } catch {
      try {
        window.localStorage.removeItem(WishlistService.storageKey);
      } catch {}
      return [];
    }
  }
}
