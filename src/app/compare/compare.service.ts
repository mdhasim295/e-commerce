import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../products/product.model';
import { PRODUCTS } from '../products/product.data';

@Injectable({ providedIn: 'root' })
export class CompareService {
  private static readonly storageKey = 'morrow-compare';
  static readonly maxProducts = 3;
  private readonly productsSubject = new BehaviorSubject<Product[]>(
    this.loadProducts(),
  );
  readonly products$ = this.productsSubject.asObservable();

  add(product: Product): boolean {
    const products = this.productsSubject.value;
    if (products.some((item) => item.id === product.id)) return true;
    if (products.length >= CompareService.maxProducts) return false;
    this.setProducts([...products, product]);
    return true;
  }

  remove(productId: number): void {
    this.setProducts(
      this.productsSubject.value.filter((product) => product.id !== productId),
    );
  }

  clear(): void {
    this.setProducts([]);
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
        CompareService.storageKey,
        JSON.stringify(products.map((product) => product.id)),
      );
    } catch {}
  }

  private loadProducts(): Product[] {
    try {
      const saved = window.localStorage.getItem(CompareService.storageKey);
      if (!saved) return [];
      const ids = JSON.parse(saved) as unknown;
      if (!Array.isArray(ids)) return [];
      const validIds = ids.filter(
        (id): id is number => Number.isInteger(id) && id > 0,
      );
      return Array.from(new Set(validIds))
        .slice(0, CompareService.maxProducts)
        .map((id) => PRODUCTS.find((product) => product.id === id))
        .filter((product): product is Product => product !== undefined);
    } catch {
      try {
        window.localStorage.removeItem(CompareService.storageKey);
      } catch {}
      return [];
    }
  }
}
