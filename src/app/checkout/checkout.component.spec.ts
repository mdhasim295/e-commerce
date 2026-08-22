import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CartService } from '../cart/cart.service';
import { PRODUCTS } from '../products/product.data';
import { CheckoutComponent } from './checkout.component';
import { OrderService } from './order.service';

describe('CheckoutComponent', () => {
  let router: jasmine.SpyObj<Router>;
  let cartService: CartService;
  let orderService: OrderService;

  async function createComponent(): Promise<CheckoutComponent> {
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [CheckoutComponent],
      providers: [
        CartService,
        OrderService,
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();
    cartService = TestBed.inject(CartService);
    orderService = TestBed.inject(OrderService);
    return TestBed.createComponent(CheckoutComponent).componentInstance;
  }

  function fillForm(component: CheckoutComponent): void {
    component.form.setValue({
      customerName: 'Hasim',
      email: 'hasim@example.com',
      address: '1 Market Street',
      city: 'London',
      postalCode: 'N1 1AA',
      delivery: 'Standard delivery',
    });
  }

  it('marks an empty checkout as a cart navigation', async () => {
    const component = await createComponent();

    component.submit();

    expect(router.navigate).toHaveBeenCalledWith(['/cart']);
  });

  it('does not submit an invalid form', async () => {
    const component = await createComponent();
    cartService.add(PRODUCTS[0]);

    component.submit();

    expect(orderService.getOrder()).toBeNull();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('creates an order, clears the cart, and navigates to confirmation', async () => {
    const component = await createComponent();
    cartService.add(PRODUCTS[0]);
    fillForm(component);

    component.submit();

    expect(orderService.getOrder()?.customerName).toBe('Hasim');
    expect(orderService.getOrder()?.items.length).toBe(1);
    expect(orderService.getOrder()?.total).toBe(PRODUCTS[0].price);
    expect(cartService.getItemCount()).toBe(0);
    expect(router.navigate).toHaveBeenCalledWith(['/order-confirmation']);
  });

  afterEach(() => {
    localStorage.removeItem('morrow-cart');
  });
});
