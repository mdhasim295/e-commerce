import { CartItem, CartService } from './cart.service';
import { PRODUCTS } from '../products/product.data';

describe('CartService', () => {
  let service: CartService;
  const firstProduct = PRODUCTS[0];
  const secondProduct = PRODUCTS[1];

  beforeEach(() => {
    localStorage.removeItem('morrow-cart');
    service = new CartService();
  });

  afterEach(() => {
    localStorage.removeItem('morrow-cart');
  });

  it('starts with an empty cart', () => {
    expect(service.getItemCount()).toBe(0);
    expect(service.getSubtotal()).toBe(0);
  });

  it('adds a product with quantity one', () => {
    service.add(firstProduct);

    let items: CartItem[] = [];
    service.items$.subscribe((value) => (items = value));

    expect(items).toEqual([{ product: firstProduct, quantity: 1 }]);
    expect(service.getItemCount()).toBe(1);
  });

  it('increments quantity when the same product is added again', () => {
    service.add(firstProduct);
    service.add(firstProduct);

    expect(service.getItemCount()).toBe(2);
    expect(service.getSubtotal()).toBe(firstProduct.price * 2);
  });

  it('calculates the subtotal for multiple products', () => {
    service.add(firstProduct);
    service.add(secondProduct);
    service.updateQuantity(secondProduct.id, 3);

    expect(service.getSubtotal()).toBe(
      firstProduct.price + secondProduct.price * 3,
    );
  });

  it('updates and removes items when quantity reaches zero', () => {
    service.add(firstProduct);
    service.updateQuantity(firstProduct.id, 4);
    expect(service.getItemCount()).toBe(4);

    service.updateQuantity(firstProduct.id, 0);
    expect(service.getItemCount()).toBe(0);
  });

  it('removes a product explicitly', () => {
    service.add(firstProduct);
    service.add(secondProduct);

    service.remove(firstProduct.id);

    expect(service.getItemCount()).toBe(1);
    expect(service.getSubtotal()).toBe(secondProduct.price);
  });

  it('returns a cart snapshot and clears all items', () => {
    service.add(firstProduct);

    expect(service.getItems()).toEqual([
      { product: firstProduct, quantity: 1 },
    ]);

    service.clear();

    expect(service.getItems()).toEqual([]);
    expect(service.getItemCount()).toBe(0);
  });

  it('persists cart changes and restores them in a new service instance', () => {
    service.add(firstProduct);
    service.updateQuantity(firstProduct.id, 3);

    const restoredService = new CartService();

    expect(restoredService.getItems()).toEqual([
      { product: firstProduct, quantity: 3 },
    ]);
  });

  it('stores the current cart as JSON after changes', () => {
    service.add(firstProduct);
    service.updateQuantity(firstProduct.id, 2);
    service.remove(firstProduct.id);
    service.add(secondProduct);

    expect(JSON.parse(localStorage.getItem('morrow-cart') || 'null')).toEqual([
      { product: secondProduct, quantity: 1 },
    ]);
  });

  it('removes persisted items when the cart is cleared', () => {
    service.add(firstProduct);

    service.clear();

    expect(localStorage.getItem('morrow-cart')).toBe('[]');
  });

  it('ignores malformed persisted cart data', () => {
    localStorage.setItem('morrow-cart', '{invalid json');

    const restoredService = new CartService();

    expect(restoredService.getItems()).toEqual([]);
    expect(localStorage.getItem('morrow-cart')).toBeNull();
  });
});
