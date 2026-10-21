import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { WishlistComponent } from './wishlist.component';
import { WishlistService } from './wishlist.service';
import { CartService } from '../cart/cart.service';
import { PRODUCTS } from '../products/product.data';
import { ToastService } from '../toast/toast.service';

describe('WishlistComponent', () => {
  beforeEach(async () => {
    localStorage.removeItem('morrow-wishlist');
    localStorage.removeItem('morrow-cart');
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [WishlistComponent],
      providers: [WishlistService, CartService, ToastService],
    }).compileComponents();
  });

  afterEach(() => {
    TestBed.inject(ToastService).dismiss();
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
    expect(TestBed.inject(ToastService).getCurrent()?.message).toContain(
      'added to your bag',
    );
  });
  it('shows a toast when a saved product is removed', () => {
    const wishlist = TestBed.inject(WishlistService);
    wishlist.toggle(PRODUCTS[0]);
    const component =
      TestBed.createComponent(WishlistComponent).componentInstance;

    component.remove(PRODUCTS[0]);

    expect(wishlist.has(PRODUCTS[0].id)).toBeFalse();
    expect(TestBed.inject(ToastService).getCurrent()?.message).toContain(
      'removed from saved pieces',
    );
  });
});
