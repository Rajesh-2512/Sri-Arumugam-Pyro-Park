import MyOrdersClient from './MyOrdersClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Orders & Order History | Sri Arumugam Pyro Park',
  description: 'View your past Sivakasi Diwali cracker orders and download official PDF tax invoices.',
};

export default function MyOrdersPage() {
  return <MyOrdersClient />;
}
