import { PRODUCTS } from './product.data';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    service = new ProductService();
  });

  it('returns the complete product catalog', () => {
    expect(service.getProducts()).toEqual(PRODUCTS);
    expect(service.getProducts().length).toBeGreaterThan(0);
  });

  it('finds a product by id', () => {
    expect(service.getProduct(PRODUCTS[0].id)).toEqual(PRODUCTS[0]);
  });

  it('returns undefined for an unknown product id', () => {
    expect(service.getProduct(-1)).toBeUndefined();
  });

  it('returns All followed by unique product categories', () => {
    const categories = service.getCategories();

    expect(categories[0]).toBe('All');
    expect(new Set(categories.slice(1)).size).toBe(categories.length - 1);
    expect(categories.slice(1)).toEqual(
      PRODUCTS.map((product) => product.category).filter(
        (category, index, values) => values.indexOf(category) === index,
      ),
    );
  });
});
