import type { Metadata } from 'next';
import PaymentInfoClient from './PaymentInfoClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sriarumugampyropark.com';

export const metadata: Metadata = {
  title: 'Payment Information, Bank Details & UPI | Sri Arumugam Pyro Park Sivakasi',
  description: 'Official bank account details, UPI ID, Google Pay, PhonePe, and payment methods for Sri Arumugam Pyro Park Sivakasi Diwali Crackers shop.',
  keywords: [
    'sri arumugam pyro park payment details',
    'sivakasi crackers bank account',
    'sivakasi crackers upi payment',
    'sivakasi crackers payment options',
  ],
  alternates: {
    canonical: `${SITE_URL}/payment-info`,
  },
};

export default function PaymentInfoPage() {
  return <PaymentInfoClient />;
}
