import { PRODUCTS } from '../products/product.data';
import { WishlistService } from './wishlist.service';

describe('WishlistService', () => {
  let service: WishlistService;

  beforeEach(() => {
    localStorage.removeItem('morrow-wishlist');
    service = new WishlistService();
  });

  afterEach(() => localStorage.removeItem('morrow-wishlist'));

  it('starts empty', () => {
    expect(service.getProducts()).toEqual([]);
    expect(service.getCount()).toBe(0);
  });

  it('adds and removes products with toggle', () => {
    service.toggle(PRODUCTS[0]);
    expect(service.has(PRODUCTS[0].id)).toBeTrue();
    expect(service.getCount()).toBe(1);

    service.toggle(PRODUCTS[0]);
    expect(service.has(PRODUCTS[0].id)).toBeFalse();
  });

  it('restores saved products', () => {
    service.toggle(PRODUCTS[1]);
    const restored = new WishlistService();

    expect(restored.getProducts()).toEqual([PRODUCTS[1]]);
  });
});
