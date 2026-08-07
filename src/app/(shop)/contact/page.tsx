import type { Metadata } from 'next';
import ContactClient from './ContactClient';
import { LocalBusinessJsonLd } from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sriarumugampyropark.com';

export const metadata: Metadata = {
  title: 'Contact Us & Store Location | Sri Arumugam Pyro Park Sivakasi',
  description:
    'Get in touch with Sri Arumugam Pyro Park in Sivakasi. Call +91 8682913516, WhatsApp, or visit our Sivakasi factory outlet at 56 House Colony, Nalan Crackers Backside, Sivakasi - 626189, Tamil Nadu.',
  keywords: [
    'sri arumugam pyro park contact',
    'sivakasi crackers shop address',
    'sivakasi crackers shop near me',
    'crackers shop sivakasi contact number',
    'sivakasi crackers whatsapp number',
    'sri arumugam pyro park sivakasi address',
    'sivakasi crackers phone number',
  ],
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: 'Contact Sri Arumugam Pyro Park | Sivakasi Crackers Shop Location',
    description:
      'Visit or contact Sri Arumugam Pyro Park — Sivakasi direct factory outlet for Diwali crackers & fireworks. Call: +91 8682913516.',
    url: `${SITE_URL}/contact`,
  },
};

export default function ContactPage() {
  return (
    <>
      <LocalBusinessJsonLd />
      <ContactClient />
    </>
  );
}
