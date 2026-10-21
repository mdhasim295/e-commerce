import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from './product.model';
import { ProductService } from './product.service';
import { CartService } from '../cart/cart.service';
import { WishlistService } from '../wishlist/wishlist.service';
import { CompareService } from '../compare/compare.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent {
  product: Product | undefined;
  added = false;
  unavailable = false;
  compareLimitReached = false;

  constructor(
    route: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly router: Router,
    public readonly wishlistService: WishlistService,
    public readonly compareService: CompareService,
  ) {
    const id = Number(route.snapshot.paramMap.get('id'));
    this.product = productService.getProduct(id);
  }

  addToCart(): void {
    if (!this.product) {
      return;
    }
    this.added = this.cartService.add(this.product);
    this.unavailable = !this.added;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  toggleWishlist(): void {
    if (this.product) this.wishlistService.toggle(this.product);
  }

  toggleCompare(): void {
    if (!this.product) return;
    if (this.compareService.has(this.product.id)) {
      this.compareService.remove(this.product.id);
      this.compareLimitReached = false;
      return;
    }
    this.compareLimitReached = !this.compareService.add(this.product);
  }
}
