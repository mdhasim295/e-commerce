import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../products/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>([]);
  readonly items$ = this.itemsSubject.asObservable();

  add(product: Product): void {
    const items = this.itemsSubject.value;
    const existing = items.find((item) => item.product.id === product.id);

    if (existing) {
      existing.quantity += 1;
      this.itemsSubject.next([...items]);
      return;
    }

    this.itemsSubject.next([...items, { product, quantity: 1 }]);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity < 1) {
      this.remove(productId);
      return;
    }

    this.itemsSubject.next(
      this.itemsSubject.value.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );
  }

  remove(productId: number): void {
    this.itemsSubject.next(
      this.itemsSubject.value.filter((item) => item.product.id !== productId),
    );
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
}
