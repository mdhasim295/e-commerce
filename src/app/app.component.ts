import { Component } from '@angular/core';
import { CartService } from './cart/cart.service';
import { WishlistService } from './wishlist/wishlist.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    public readonly cartService: CartService,
    public readonly wishlistService: WishlistService,
  ) {}
}
