import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Order } from './order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private static readonly historyKey = 'morrow-orders';
  private readonly orderSubject = new BehaviorSubject<Order | null>(null);
  private readonly ordersSubject = new BehaviorSubject<Order[]>(
    this.loadOrders(),
  );
  readonly order$ = this.orderSubject.asObservable();
  readonly orders$ = this.ordersSubject.asObservable();

  setOrder(order: Order): void {
    this.orderSubject.next(order);
    const orders = [
      order,
      ...this.ordersSubject.value.filter(
        (savedOrder) => savedOrder.number !== order.number,
      ),
    ];
    this.ordersSubject.next(orders);
    try {
      window.localStorage.setItem(
        OrderService.historyKey,
        JSON.stringify(orders),
      );
    } catch {}
  }

  getOrder(): Order | null {
    return this.orderSubject.value;
  }

  getOrders(): Order[] {
    return [...this.ordersSubject.value];
  }

  private loadOrders(): Order[] {
    try {
      const saved = window.localStorage.getItem(OrderService.historyKey);
      if (!saved) return [];
      const orders = JSON.parse(saved) as Order[];
      return Array.isArray(orders) ? orders : [];
    } catch {
      return [];
    }
  }
}
