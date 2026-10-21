import { Component } from '@angular/core';
import { CartService } from '../cart/cart.service';
import { Product } from '../products/product.model';
import { CompareService } from './compare.service';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss'],
})
export class CompareComponent {
  addedProductId: number | null = null;

  constructor(
    public readonly compareService: CompareService,
    private readonly cartService: CartService,
  ) {}

  addToCart(product: Product): void {
    if (this.cartService.add(product)) this.addedProductId = product.id;
  }
}
