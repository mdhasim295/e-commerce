import { Component } from '@angular/core';
import { WishlistService } from './wishlist.service';
import { CartService } from '../cart/cart.service';
import { Product } from '../products/product.model';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent {
  constructor(
    public readonly wishlistService: WishlistService,
    private readonly cartService: CartService,
  ) {}

  addToCart(product: Product): void {
    this.cartService.add(product);
  }

  remove(product: Product): void {
    this.wishlistService.toggle(product);
  }
}
