import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../products/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private static readonly storageKey = 'morrow-cart';
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>(
    this.loadItems(),
  );
  readonly items$ = this.itemsSubject.asObservable();

  add(product: Product): void {
    const items = this.itemsSubject.value;
    const existing = items.find((item) => item.product.id === product.id);

    if (existing) {
      existing.quantity += 1;
      this.setItems(items);
      return;
    }

    this.setItems([...items, { product, quantity: 1 }]);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity < 1) {
      this.remove(productId);
      return;
    }

    this.setItems(
      this.itemsSubject.value.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
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
      const items = JSON.parse(savedItems) as CartItem[];
      return Array.isArray(items) ? items : [];
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
}
