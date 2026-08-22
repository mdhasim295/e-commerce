import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CartService } from '../cart/cart.service';
import { PRODUCTS } from './product.data';
import { ProductListComponent } from './product-list.component';
import { ProductService } from './product.service';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let cartService: CartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [ProductListComponent],
      providers: [ProductService, CartService],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
  });

  it('loads the catalog and categories', () => {
    expect(component.products).toEqual(PRODUCTS);
    expect(component.categories[0]).toBe('All');
  });

  it('filters products by case-insensitive search text', () => {
    component.searchTerm = `  ${PRODUCTS[0].name.toUpperCase()}  `;

    expect(component.filteredProducts).toEqual([PRODUCTS[0]]);
  });

  it('filters products by category and search together', () => {
    component.selectedCategory = PRODUCTS[0].category;
    component.searchTerm = PRODUCTS[0].name;

    expect(component.filteredProducts).toEqual([PRODUCTS[0]]);
  });

  it('returns no products when no filter matches', () => {
    component.searchTerm = 'not a real product';

    expect(component.filteredProducts).toEqual([]);
  });

  it('adds a product to the cart and clears feedback after a moment', fakeAsync(() => {
    component.addToCart(PRODUCTS[0]);

    expect(cartService.getItemCount()).toBe(1);
    expect(component.addedProductId).toBe(PRODUCTS[0].id);

    tick(1200);
    expect(component.addedProductId).toBeNull();
  }));
});
