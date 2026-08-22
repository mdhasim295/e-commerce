import { CartItem } from '../cart/cart.service';

export interface Order {
  number: string;
  customerName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  delivery: string;
  items: CartItem[];
  total: number;
}
