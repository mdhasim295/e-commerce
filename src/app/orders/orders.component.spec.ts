import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CartService } from '../cart/cart.service';
import { PRODUCTS } from '../products/product.data';
import { Order } from '../checkout/order.model';
import { OrderService } from '../checkout/order.service';
import { OrdersComponent } from './orders.component';

describe('OrdersComponent', () => {
  const order: Order = {
    number: 'MRW-123456',
    createdAt: '2026-08-23T10:00:00.000Z',
    customerName: 'Hasim',
    email: 'hasim@example.com',
    address: '1 Market Street',
    city: 'London',
    postalCode: 'N1 1AA',
    delivery: 'Standard delivery',
    items: [{ product: PRODUCTS[0], quantity: 1 }],
    total: PRODUCTS[0].price,
  };

  beforeEach(() => {
    localStorage.removeItem('morrow-orders');
    localStorage.removeItem('morrow-cart');
  });

  afterEach(() => {
    localStorage.removeItem('morrow-orders');
    localStorage.removeItem('morrow-cart');
  });

  it('renders saved order details', async () => {
    const orderService = new OrderService();
    orderService.setOrder(order);
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [OrdersComponent],
      providers: [
        { provide: OrderService, useValue: orderService },
        CartService,
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(OrdersComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('MRW-123456');
    expect(fixture.nativeElement.textContent).toContain('Linen Table Lamp');
  });

  it('adds available items to the cart with Buy again', async () => {
    const orderService = new OrderService();
    orderService.setOrder(order);
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [OrdersComponent],
      providers: [
        { provide: OrderService, useValue: orderService },
        CartService,
      ],
    }).compileComponents();
    const component =
      TestBed.createComponent(OrdersComponent).componentInstance;

    component.buyAgain(order);

    expect(TestBed.inject(CartService).getItemCount()).toBe(1);
  });
});
