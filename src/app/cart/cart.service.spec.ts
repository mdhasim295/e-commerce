import { CartItem, CartService } from './cart.service';
import { PRODUCTS } from '../products/product.data';

describe('CartService', () => {
  let service: CartService;
  const firstProduct = PRODUCTS[0];
  const secondProduct = PRODUCTS[1];

  beforeEach(() => {
    service = new CartService();
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
});
