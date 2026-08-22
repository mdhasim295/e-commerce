import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CartComponent } from './cart/cart.component';
import { ProductDetailComponent } from './products/product-detail.component';
import { ProductListComponent } from './products/product-list.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { OrdersComponent } from './orders/orders.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductDetailComponent,
    CartComponent,
    CheckoutComponent,
    OrderConfirmationComponent,
    WishlistComponent,
    OrdersComponent,
  ],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
