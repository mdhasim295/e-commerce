import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../products/product.model';
import { PRODUCTS } from '../products/product.data';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private static readonly storageKey = 'morrow-cart';
  private readonly itemsSubject: BehaviorSubject<CartItem[]>;
  readonly items$;

  constructor() {
    const items = this.loadItems();
    this.itemsSubject = new BehaviorSubject<CartItem[]>(items);
    this.items$ = this.itemsSubject.asObservable();
    this.saveItems(items);
  }

  add(product: Product): boolean {
    const items = this.itemsSubject.value;
    const existing = items.find((item) => item.product.id === product.id);

    if (existing) {
      if (existing.quantity >= product.stock) {
        return false;
      }
      existing.quantity += 1;
      this.setItems(items);
      return true;
    }

    if (product.stock < 1) {
      return false;
    }
    this.setItems([...items, { product, quantity: 1 }]);
    return true;
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity < 1) {
      this.remove(productId);
      return;
    }

    this.setItems(
      this.itemsSubject.value.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock) }
          : item,
      ),
    );
  }

  remove(productId: number): void {
    this.setItems(
      this.itemsSubject.value.filter((item) => item.product.id !== productId),
    );
  }

  getItems(): CartItem[] {
    return this.itemsSubject.value.map((item) => ({ ...item }));
  }

  clear(): void {
    this.setItems([]);
  }

  getItemCount(): number {
    return this.itemsSubject.value.reduce(
      (total, item) => total + item.quantity,
      0,
    );
  }

  getSubtotal(): number {
    return this.itemsSubject.value.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  }

  private setItems(items: CartItem[]): void {
    this.itemsSubject.next(items);
    this.saveItems(items);
  }

  private loadItems(): CartItem[] {
    let savedItems: string | null;

    try {
      savedItems = window.localStorage.getItem(CartService.storageKey);
    } catch {
      return [];
    }

    if (!savedItems) {
      return [];
    }

    try {
      const items = JSON.parse(savedItems) as unknown;
      if (!Array.isArray(items)) {
        return [];
      }

      return items.reduce<CartItem[]>((validItems, item: unknown) => {
        if (!this.isCartItem(item)) {
          return validItems;
        }

        const product = PRODUCTS.find(
          (catalogProduct) => catalogProduct.id === item.product.id,
        );
        const quantity = Math.floor(item.quantity);

        if (!product || product.stock < 1 || quantity < 1) {
          return validItems;
        }

        validItems.push({
          product,
          quantity: Math.min(quantity, product.stock),
        });
        return validItems;
      }, []);
    } catch {
      try {
        window.localStorage.removeItem(CartService.storageKey);
      } catch {}
      return [];
    }
  }

  private saveItems(items: CartItem[]): void {
    try {
      window.localStorage.setItem(
        CartService.storageKey,
        JSON.stringify(items),
      );
    } catch {}
  }

  private isCartItem(item: unknown): item is CartItem {
    if (!item || typeof item !== 'object') {
      return false;
    }

    const candidate = item as Partial<CartItem>;
    return (
      !!candidate.product &&
      typeof candidate.product === 'object' &&
      Number.isFinite(candidate.product.id) &&
      Number.isFinite(candidate.quantity)
    );
  }
}
