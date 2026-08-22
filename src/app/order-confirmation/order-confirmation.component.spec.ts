import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { OrderConfirmationComponent } from './order-confirmation.component';
import { OrderService } from '../checkout/order.service';
import { PRODUCTS } from '../products/product.data';

describe('OrderConfirmationComponent', () => {
  it('shows the most recent order', async () => {
    const orderService = new OrderService();
    orderService.setOrder({
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
    });
    const router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [OrderConfirmationComponent],
      providers: [
        { provide: OrderService, useValue: orderService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(OrderConfirmationComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('MRW-123456');
    expect(fixture.nativeElement.textContent).toContain('Hasim');
    expect(fixture.nativeElement.textContent).toContain(
      `$${PRODUCTS[0].price}`,
    );
  });

  it('handles a missing recent order', async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [OrderConfirmationComponent],
      providers: [OrderService],
    }).compileComponents();

    const fixture = TestBed.createComponent(OrderConfirmationComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No recent order');
  });
});
