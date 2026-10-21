import { Component } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { CartService } from '../cart/cart.service';
import { WishlistService } from '../wishlist/wishlist.service';
import { CompareService } from '../compare/compare.service';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {
  products: Product[] = [];
  categories: string[] = [];
  searchTerm = '';
  selectedCategory = 'All';
  sortOption = 'featured';

  constructor(
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    public readonly wishlistService: WishlistService,
    public readonly compareService: CompareService,
    private readonly toastService: ToastService,
  ) {
    this.products = productService.getProducts();
    this.categories = productService.getCategories();
  }

  get filteredProducts(): Product[] {
    const term = this.searchTerm.trim().toLowerCase();
    const filtered = this.products.filter((product) => {
      const matchesCategory =
        this.selectedCategory === 'All' ||
        product.category === this.selectedCategory;
      const matchesSearch =
        !term ||
        `${product.name} ${product.category}`.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
    return [...filtered].sort((first, second) => {
      if (this.sortOption === 'price-low') return first.price - second.price;
      if (this.sortOption === 'price-high') return second.price - first.price;
      if (this.sortOption === 'rating') return second.rating - first.rating;
      return first.id - second.id;
    });
  }

  addToCart(product: Product): void {
    if (!this.cartService.add(product)) {
      this.toastService.show('Stock limit reached for this piece.', 'error');
      return;
    }
    this.toastService.show(`${product.name} added to your bag.`, 'success');
  }

  toggleWishlist(product: Product): void {
    const wasSaved = this.wishlistService.has(product.id);
    this.wishlistService.toggle(product);
    this.toastService.show(
      wasSaved
        ? `${product.name} removed from saved pieces.`
        : `${product.name} saved for later.`,
      'success',
    );
  }

  toggleCompare(product: Product): void {
    if (this.compareService.has(product.id)) {
      this.compareService.remove(product.id);
      this.toastService.show(
        `${product.name} removed from comparison.`,
        'info',
      );
      return;
    }
    if (!this.compareService.add(product)) {
      this.toastService.show('Compare up to 3 pieces at a time.', 'error');
      return;
    }
    this.toastService.show(`${product.name} added to comparison.`, 'success');
  }
}
