import { CompareService } from './compare.service';
import { PRODUCTS } from '../products/product.data';

describe('CompareService', () => {
  let service: CompareService;

  beforeEach(() => {
    localStorage.removeItem('morrow-compare');
    service = new CompareService();
  });

  afterEach(() => localStorage.removeItem('morrow-compare'));

  it('starts empty and adds products only once', () => {
    expect(service.getCount()).toBe(0);
    expect(service.add(PRODUCTS[0])).toBeTrue();
    expect(service.add(PRODUCTS[0])).toBeTrue();
    expect(service.getProducts()).toEqual([PRODUCTS[0]]);
  });

  it('removes products and clears the comparison list', () => {
    service.add(PRODUCTS[0]);
    service.add(PRODUCTS[1]);
    service.remove(PRODUCTS[0].id);

    expect(service.getProducts()).toEqual([PRODUCTS[1]]);

    service.clear();
    expect(service.getProducts()).toEqual([]);
  });

  it('limits comparisons to three products', () => {
    expect(service.add(PRODUCTS[0])).toBeTrue();
    expect(service.add(PRODUCTS[1])).toBeTrue();
    expect(service.add(PRODUCTS[2])).toBeTrue();
    expect(service.add(PRODUCTS[3])).toBeFalse();
    expect(service.getCount()).toBe(3);
  });

  it('restores saved product IDs from local storage', () => {
    service.add(PRODUCTS[1]);
    const restored = new CompareService();

    expect(restored.getProducts()).toEqual([PRODUCTS[1]]);
  });
});
