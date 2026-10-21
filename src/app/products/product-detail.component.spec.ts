import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CartService } from '../cart/cart.service';
import { PRODUCTS } from './product.data';
import { ProductDetailComponent } from './product-detail.component';
import { ProductService } from './product.service';
import { WishlistService } from '../wishlist/wishlist.service';
import { CompareService } from '../compare/compare.service';

describe('ProductDetailComponent', () => {
  let router: jasmine.SpyObj<Router>;
  let cartService: CartService;

  async function createComponent(
    routeId: string,
  ): Promise<ProductDetailComponent> {
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ProductDetailComponent],
      providers: [
        ProductService,
        CartService,
        WishlistService,
        CompareService,
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => routeId } } },
        },
      ],
    }).compileComponents();

    cartService = TestBed.inject(CartService);
    return TestBed.createComponent(ProductDetailComponent).componentInstance;
  }

  it('loads the product selected by the route', async () => {
    const component = await createComponent(String(PRODUCTS[0].id));

    expect(component.product).toEqual(PRODUCTS[0]);
  });

  it('handles an unknown product route', async () => {
    const component = await createComponent('999');

    expect(component.product).toBeUndefined();
  });

  it('adds the product to the cart and shows confirmation', async () => {
    const component = await createComponent(String(PRODUCTS[0].id));

    component.addToCart();

    expect(cartService.getItemCount()).toBe(1);
    expect(component.added).toBeTrue();
  });

  it('navigates back to the collection', async () => {
    const component = await createComponent(String(PRODUCTS[0].id));

    component.goBack();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('toggles the product wishlist state', async () => {
    const component = await createComponent(String(PRODUCTS[0].id));

    component.toggleWishlist();
    expect(component.wishlistService.has(PRODUCTS[0].id)).toBeTrue();

    component.toggleWishlist();
    expect(component.wishlistService.has(PRODUCTS[0].id)).toBeFalse();
  });

  it('adds the product to comparison', async () => {
    const component = await createComponent(String(PRODUCTS[0].id));

    component.toggleCompare();

    expect(component.compareService.has(PRODUCTS[0].id)).toBeTrue();
  });

  afterEach(() => {
    localStorage.removeItem('morrow-cart');
    localStorage.removeItem('morrow-compare');
  });
});
