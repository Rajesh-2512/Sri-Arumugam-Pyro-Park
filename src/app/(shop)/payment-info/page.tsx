import type { Metadata } from 'next';
import PaymentInfoClient from './PaymentInfoClient';

export const metadata: Metadata = {
  title: 'Payment Information & Bank Details',
  description: 'Official bank details, Google Pay, PhonePe, and UPI QR codes for Sri Arumugam Pyro Park Sivakasi.',
};

export default function PaymentInfoPage() {
  return <PaymentInfoClient />;
}
