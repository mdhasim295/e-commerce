import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../cart/cart.service';
import { OrderService } from './order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent {
  readonly expressDeliveryPrice = 12;

  readonly form = this.formBuilder.group({
    customerName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: [
      '',
      [Validators.required, Validators.pattern('^[0-9A-Za-z -]{4,10}$')],
    ],
    delivery: ['Standard delivery', Validators.required],
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    public readonly cartService: CartService,
    private readonly orderService: OrderService,
    private readonly router: Router,
  ) {}

  get deliveryCost(): number {
    return this.form.controls.delivery.value === 'Express delivery'
      ? this.expressDeliveryPrice
      : 0;
  }

  get orderTotal(): number {
    return this.cartService.getSubtotal() + this.deliveryCost;
  }

  submit(): void {
    if (this.cartService.getItemCount() === 0) {
      this.router.navigate(['/cart']);
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.orderService.setOrder({
      number: `MRW-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      customerName: value.customerName || '',
      email: value.email || '',
      address: value.address || '',
      city: value.city || '',
      postalCode: value.postalCode || '',
      delivery: value.delivery || 'Standard delivery',
      deliveryCost: this.deliveryCost,
      items: this.cartService.getItems(),
      total: this.orderTotal,
    });
    this.cartService.clear();
    this.router.navigate(['/order-confirmation']);
  }
}
