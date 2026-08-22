import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { WishlistComponent } from './wishlist.component';
import { WishlistService } from './wishlist.service';
import { CartService } from '../cart/cart.service';
import { PRODUCTS } from '../products/product.data';

describe('WishlistComponent', () => {
  beforeEach(async () => {
    localStorage.removeItem('morrow-wishlist');
    localStorage.removeItem('morrow-cart');
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [WishlistComponent],
      providers: [WishlistService, CartService],
    }).compileComponents();
  });

  afterEach(() => {
    localStorage.removeItem('morrow-wishlist');
    localStorage.removeItem('morrow-cart');
  });

  it('renders an empty wishlist', () => {
    const fixture = TestBed.createComponent(WishlistComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      "haven't saved any pieces",
    );
  });

  it('adds a wishlist product to the cart', () => {
    const wishlist = TestBed.inject(WishlistService);
    wishlist.toggle(PRODUCTS[0]);
    const component =
      TestBed.createComponent(WishlistComponent).componentInstance;

    component.addToCart(PRODUCTS[0]);

    expect(TestBed.inject(CartService).getItemCount()).toBe(1);
  });
});
