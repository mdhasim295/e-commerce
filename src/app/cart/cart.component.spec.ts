import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CartComponent } from './cart.component';
import { CartService } from './cart.service';
import { PRODUCTS } from '../products/product.data';

describe('CartComponent', () => {
  let fixture: ComponentFixture<CartComponent>;
  let component: CartComponent;
  let cartService: CartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CartComponent],
      providers: [CartService],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService);
  });

  it('shows the empty cart state initially', () => {
    fixture.detectChanges();

    expect(component.items).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain('Your bag is waiting');
  });

  it('reflects products added to the cart', () => {
    cartService.add(PRODUCTS[0]);
    fixture.detectChanges();

    expect(component.items.length).toBe(1);
    expect(fixture.nativeElement.textContent).toContain(PRODUCTS[0].name);
    expect(fixture.nativeElement.textContent).toContain(
      `$${PRODUCTS[0].price}`,
    );
  });
});
