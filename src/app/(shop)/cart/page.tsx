import type { Metadata } from 'next';
import CartClient from './CartClient';

export const metadata: Metadata = {
  title: 'Shopping Cart & Order Summary',
  description: 'Review your selected Sivakasi Diwali crackers in your cart and proceed to quick checkout.',
};

export default function CartPage() {
  return <CartClient />;
}
