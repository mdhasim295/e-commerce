import { Component } from '@angular/core';
import { CartItem, CartService } from './cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  items: CartItem[] = [];

  constructor(public readonly cartService: CartService) {
    cartService.items$.subscribe((items) => (this.items = items));
  }
}
