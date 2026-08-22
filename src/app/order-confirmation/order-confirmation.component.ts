import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../checkout/order.model';
import { OrderService } from '../checkout/order.service';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss'],
})
export class OrderConfirmationComponent {
  readonly order: Order | null;

  constructor(
    orderService: OrderService,
    private readonly router: Router,
  ) {
    this.order = orderService.getOrder();
  }

  returnToCollection(): void {
    this.router.navigate(['/']);
  }
}
