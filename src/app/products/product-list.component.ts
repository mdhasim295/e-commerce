import { Component } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { CartService } from '../cart/cart.service';

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

  constructor(
    private readonly productService: ProductService,
    private readonly cartService: CartService,
  ) {
    this.products = productService.getProducts();
    this.categories = productService.getCategories();
  }

  get filteredProducts(): Product[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.products.filter((product) => {
      const matchesCategory =
        this.selectedCategory === 'All' ||
        product.category === this.selectedCategory;
      const matchesSearch =
        !term ||
        `${product.name} ${product.category}`.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }

  addToCart(product: Product): void {
    this.cartService.add(product);
    this.addedProductId = product.id;
    window.setTimeout(() => (this.addedProductId = null), 1200);
  }
}
