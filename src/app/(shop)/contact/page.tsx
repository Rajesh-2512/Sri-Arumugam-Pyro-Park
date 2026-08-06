import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us & Store Location',
  description: 'Get in touch with Sri Arumugam Pyro Park in Sivakasi. Call, WhatsApp, or visit our Sivakasi outlet.',
};

export default function ContactPage() {
  return <ContactClient />;
}
