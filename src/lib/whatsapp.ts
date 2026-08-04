import type { CartItem } from '@/store/cart.store';

interface WhatsAppOrderParams {
  orderId: string;
  customerName: string;
  items: CartItem[];
  totalAmount: number;
  address: string;
}

export const generateWhatsAppURL = ({
  orderId,
  customerName,
  items,
  totalAmount,
  address,
}: WhatsAppOrderParams): string => {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
  const shortId = orderId.split('-')[0].toUpperCase();

  const itemLines = items
    .map((item) => `  • ${item.name} × ${item.quantity} = ₹${(item.finalPrice * item.quantity).toFixed(0)}`)
    .join('\n');

  const message = `
🎆 *New Crackers Order*

*Order ID:* #${shortId}
*Name:* ${customerName}
*Address:* ${address}

*Items:*
${itemLines}

*Total: ₹${totalAmount.toFixed(0)}*

Please confirm this order. Thank you! 🙏
`.trim();

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};
