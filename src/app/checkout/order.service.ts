import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Order } from './order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly orderSubject = new BehaviorSubject<Order | null>(null);
  readonly order$ = this.orderSubject.asObservable();

  setOrder(order: Order): void {
    this.orderSubject.next(order);
  }

  getOrder(): Order | null {
    return this.orderSubject.value;
  }
}
