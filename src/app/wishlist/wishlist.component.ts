import { Component } from '@angular/core';
import { WishlistService } from './wishlist.service';
import { CartService } from '../cart/cart.service';
import { Product } from '../products/product.model';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent {
  constructor(
    public readonly wishlistService: WishlistService,
    private readonly cartService: CartService,
    private readonly toastService: ToastService,
  ) {}

  addToCart(product: Product): void {
    if (!this.cartService.add(product)) {
      this.toastService.show('Stock limit reached for this piece.', 'error');
      return;
    }
    this.toastService.show(`${product.name} added to your bag.`, 'success');
  }

  remove(product: Product): void {
    this.wishlistService.toggle(product);
    this.toastService.show(
      `${product.name} removed from saved pieces.`,
      'info',
    );
  }
}
