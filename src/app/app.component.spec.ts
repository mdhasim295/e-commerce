import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { CartService } from './cart/cart.service';
import { CompareService } from './compare/compare.service';
import { ToastHostComponent } from './toast/toast-host.component';
import { ToastService } from './toast/toast.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent, ToastHostComponent],
      providers: [CartService, CompareService],
    }).compileComponents();
  });

  it('should create the store shell', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the brand and navigation', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand')?.textContent).toContain('morrow');
    expect(compiled.querySelector('.bag-link')?.textContent).toContain('Bag');
    expect(compiled.querySelector('app-toast-host')).not.toBeNull();
  });

  it('renders notifications in a polite live region with a dismiss control', () => {
    const fixture = TestBed.createComponent(AppComponent);
    TestBed.inject(ToastService).show('Added to bag', 'success');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[role="status"]')?.textContent).toContain(
      'Added to bag',
    );
    expect(
      compiled.querySelector('button[aria-label="Dismiss notification"]'),
    ).not.toBeNull();
    TestBed.inject(ToastService).dismiss();
  });
});
