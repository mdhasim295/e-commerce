import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from './product.model';
import { ProductService } from './product.service';
import { CartService } from '../cart/cart.service';
import { WishlistService } from '../wishlist/wishlist.service';
import { CompareService } from '../compare/compare.service';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent {
  product: Product | undefined;
  added = false;
  constructor(
    route: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly router: Router,
    public readonly wishlistService: WishlistService,
    public readonly compareService: CompareService,
    private readonly toastService: ToastService,
  ) {
    const id = Number(route.snapshot.paramMap.get('id'));
    this.product = productService.getProduct(id);
  }

  addToCart(): void {
    if (!this.product) {
      return;
    }
    if (!this.cartService.add(this.product)) {
      this.toastService.show('Stock limit reached for this piece.', 'error');
      return;
    }
    this.added = true;
    this.toastService.show(
      `${this.product.name} added to your bag.`,
      'success',
    );
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  toggleWishlist(): void {
    if (!this.product) return;
    const wasSaved = this.wishlistService.has(this.product.id);
    this.wishlistService.toggle(this.product);
    this.toastService.show(
      wasSaved
        ? `${this.product.name} removed from saved pieces.`
        : `${this.product.name} saved for later.`,
      'success',
    );
  }

  toggleCompare(): void {
    if (!this.product) return;
    if (this.compareService.has(this.product.id)) {
      this.compareService.remove(this.product.id);
      this.toastService.show(
        `${this.product.name} removed from comparison.`,
        'info',
      );
      return;
    }
    if (!this.compareService.add(this.product)) {
      this.toastService.show('Compare up to 3 pieces at a time.', 'error');
      return;
    }
    this.toastService.show(
      `${this.product.name} added to comparison.`,
      'success',
    );
  }
}
