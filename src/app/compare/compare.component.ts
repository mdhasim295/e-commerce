import { Component } from '@angular/core';
import { CartService } from '../cart/cart.service';
import { Product } from '../products/product.model';
import { CompareService } from './compare.service';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss'],
})
export class CompareComponent {
  constructor(
    public readonly compareService: CompareService,
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
    this.compareService.remove(product.id);
    this.toastService.show(`${product.name} removed from comparison.`, 'info');
  }
}
