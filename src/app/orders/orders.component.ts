import { Component } from '@angular/core';
import { CartService } from '../cart/cart.service';
import { OrderService } from '../checkout/order.service';
import { Order } from '../checkout/order.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent {
  orders: Order[] = [];
  buyAgainMessage = '';

  constructor(
    private readonly orderService: OrderService,
    private readonly cartService: CartService,
  ) {
    this.orders = orderService.getOrders();
  }

  buyAgain(order: Order): void {
    let addedCount = 0;
    order.items.forEach((item) => {
      for (let quantity = 0; quantity < item.quantity; quantity += 1) {
        if (this.cartService.add(item.product)) {
          addedCount += 1;
        }
      }
    });
    this.buyAgainMessage =
      addedCount > 0
        ? `${addedCount} item${addedCount === 1 ? '' : 's'} added to your bag.`
        : 'Those items are currently unavailable.';
  }
}
