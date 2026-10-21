import { CartItem } from '../cart/cart.service';

export interface Order {
  number: string;
  createdAt: string;
  customerName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  delivery: string;
  /** Optional to support orders saved before delivery pricing was added. */
  deliveryCost?: number;
  items: CartItem[];
  total: number;
}
