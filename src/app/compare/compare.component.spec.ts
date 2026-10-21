import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CartService } from '../cart/cart.service';
import { PRODUCTS } from '../products/product.data';
import { CompareComponent } from './compare.component';
import { CompareService } from './compare.service';
import { ToastService } from '../toast/toast.service';

describe('CompareComponent', () => {
  beforeEach(async () => {
    localStorage.removeItem('morrow-cart');
    localStorage.removeItem('morrow-compare');
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CompareComponent],
      providers: [CartService, CompareService, ToastService],
    }).compileComponents();
  });

  afterEach(() => {
    TestBed.inject(ToastService).dismiss();
    localStorage.removeItem('morrow-cart');
    localStorage.removeItem('morrow-compare');
  });

  it('adds a compared product to the cart and shows a toast', () => {
    const component =
      TestBed.createComponent(CompareComponent).componentInstance;

    component.addToCart(PRODUCTS[0]);

    expect(TestBed.inject(CartService).getItemCount()).toBe(1);
    expect(TestBed.inject(ToastService).getCurrent()?.message).toContain(
      'added to your bag',
    );
  });

  it('shows a toast when a product is removed from comparison', () => {
    const compareService = TestBed.inject(CompareService);
    compareService.add(PRODUCTS[0]);
    const component =
      TestBed.createComponent(CompareComponent).componentInstance;

    component.remove(PRODUCTS[0]);

    expect(compareService.has(PRODUCTS[0].id)).toBeFalse();
    expect(TestBed.inject(ToastService).getCurrent()?.message).toContain(
      'removed from comparison',
    );
  });
});
