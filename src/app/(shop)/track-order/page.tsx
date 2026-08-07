import TrackOrderClient from './TrackOrderClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Order & Share Feedback | Sri Arumugam Pyro Park',
  description: 'Live order tracking by Phone Number or Order ID for 5,000+ happy Sivakasi Diwali customers. Share your feedback & download invoice PDFs.',
};

export default function TrackOrderPage() {
  return <TrackOrderClient />;
}
