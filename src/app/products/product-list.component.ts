import { Component } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { CartService } from '../cart/cart.service';
import { WishlistService } from '../wishlist/wishlist.service';

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
  addedProductId: number | null = null;
  unavailableProductId: number | null = null;
  sortOption = 'featured';

  constructor(
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    public readonly wishlistService: WishlistService,
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
      this.unavailableProductId = product.id;
      window.setTimeout(() => (this.unavailableProductId = null), 1200);
      return;
    }
    this.addedProductId = product.id;
    window.setTimeout(() => (this.addedProductId = null), 1200);
  }

  toggleWishlist(product: Product): void {
    this.wishlistService.toggle(product);
  }
}
