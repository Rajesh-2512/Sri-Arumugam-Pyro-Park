import nodemailer from 'nodemailer';

interface OrderItem {
  name?: string;
  product_name?: string;
  price?: number;
  finalPrice?: number;
  quantity?: number;
}

interface OrderEmailInput {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  aadharPan?: string;
  totalAmount: number;
  paidAmount?: number;
  notes?: string;
  items: OrderItem[];
  createdAt?: string;
}

/**
 * Creates Nodemailer Transporter using environment variables.
 * Defaults to Gmail SMTP (smtp.gmail.com) on port 465 SSL.
 */
function createTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE !== 'false' && (port === 465);
  const user = process.env.SMTP_USER || 'sriarumugampyropark.svks@gmail.com';
  const pass = process.env.SMTP_PASS || '';

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Builds clean HTML email layout for new order notification
 */
function buildOrderEmailHtml(data: OrderEmailInput): string {
  const shortId = data.orderId.slice(0, 8).toUpperCase();
  const formattedTotal = `₹${data.totalAmount.toLocaleString('en-IN')}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sriarumugampyropark.com';
  const cleanPhone = data.phone.replace(/\D/g, '');
  const orderDate = data.createdAt
    ? new Date(data.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const itemRowsHtml = data.items
    .map((item, index) => {
      const name = item.name || item.product_name || 'Cracker Item';
      const price = typeof item.finalPrice === 'number'
        ? item.finalPrice
        : (typeof item.price === 'number' ? item.price : 0);
      const qty = item.quantity || 1;
      const rowTotal = price * qty;

      return `
        <tr style="border-bottom: 1px solid #e5e7eb; ${index % 2 === 0 ? 'background-color: #f9fafb;' : ''}">
          <td style="padding: 12px 16px; font-weight: 500; color: #111827;">${index + 1}. ${name}</td>
          <td style="padding: 12px 16px; text-align: center; color: #374151;">${qty}</td>
          <td style="padding: 12px 16px; text-align: right; color: #374151;">₹${price.toLocaleString('en-IN')}</td>
          <td style="padding: 12px 16px; text-align: right; font-weight: 600; color: #111827;">₹${rowTotal.toLocaleString('en-IN')}</td>
        </tr>
      `;
    })
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order #${shortId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f3f4f6; padding: 20px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 650px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 28px 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;">
                💥 SRI ARUMUGAM PYRO PARK
              </h1>
              <p style="margin: 6px 0 0 0; color: #fef08a; font-size: 14px; font-weight: 600;">
                🎉 NEW ONLINE ORDER RECEIVED!
              </p>
            </td>
          </tr>

          <!-- Order Summary Card -->
          <tr>
            <td style="padding: 24px;">
              <table role="presentation" width="100%" style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <tr>
                  <td style="font-size: 14px; color: #991b1b;">
                    <strong>Order ID:</strong> <span style="font-family: monospace; font-size: 16px; font-weight: 700;">#${shortId}</span><br>
                    <span style="font-size: 11px; color: #6b7280; word-break: break-all;">(${data.orderId})</span><br>
                    <strong>Date & Time:</strong> ${orderDate}<br>
                    <strong>Status:</strong> <span style="display: inline-block; background-color: #fef08a; color: #854d0e; font-weight: 700; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-top: 4px;">PENDING</span>
                  </td>
                  <td align="right" style="vertical-align: top;">
                    <div style="font-size: 12px; color: #7f1d1d; text-transform: uppercase; font-weight: 600;">Total Amount</div>
                    <div style="font-size: 24px; font-weight: 800; color: #dc2626;">${formattedTotal}</div>
                  </td>
                </tr>
              </table>

              <!-- Customer Details Section -->
              <h2 style="font-size: 16px; font-weight: 700; color: #111827; margin: 0 0 12px 0; border-bottom: 2px solid #ef4444; padding-bottom: 6px;">
                👤 Customer Information
              </h2>
              <table role="presentation" width="100%" style="margin-bottom: 24px; font-size: 14px; color: #374151;">
                <tr>
                  <td style="padding: 6px 0; width: 130px; font-weight: 600;">Full Name:</td>
                  <td style="padding: 6px 0; font-weight: 700; color: #111827;">${data.customerName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: 600;">Phone Number:</td>
                  <td style="padding: 6px 0;">
                    <a href="tel:${data.phone}" style="color: #dc2626; font-weight: 700; text-decoration: none;">${data.phone}</a>
                    &nbsp;|&nbsp;
                    <a href="https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}" target="_blank" style="color: #16a34a; font-weight: 600; text-decoration: none;">💬 WhatsApp Customer</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: 600; vertical-align: top;">Delivery Address:</td>
                  <td style="padding: 6px 0; color: #111827;">
                    ${data.address}<br>
                    ${data.city ? `${data.city}, ` : ''}${data.state || 'Tamil Nadu'}${data.pincode ? ` - PIN: ${data.pincode}` : ''}
                  </td>
                </tr>
                ${data.aadharPan ? `
                <tr>
                  <td style="padding: 6px 0; font-weight: 600;">Aadhar / PAN:</td>
                  <td style="padding: 6px 0; font-weight: 600; color: #1f2937;">${data.aadharPan}</td>
                </tr>
                ` : ''}
                ${data.notes ? `
                <tr>
                  <td style="padding: 6px 0; font-weight: 600; vertical-align: top;">Customer Notes:</td>
                  <td style="padding: 6px 0; font-style: italic; color: #4b5563;">${data.notes}</td>
                </tr>
                ` : ''}
              </table>

              <!-- Order Items Table -->
              <h2 style="font-size: 16px; font-weight: 700; color: #111827; margin: 0 0 12px 0; border-bottom: 2px solid #ef4444; padding-bottom: 6px;">
                📦 Ordered Items (${data.items.length})
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; width: 100%; font-size: 14px; margin-bottom: 24px;">
                <thead>
                  <tr style="background-color: #ef4444; color: #ffffff; font-size: 13px;">
                    <th style="padding: 10px 16px; text-align: left; border-top-left-radius: 6px;">Product</th>
                    <th style="padding: 10px 16px; text-align: center;">Qty</th>
                    <th style="padding: 10px 16px; text-align: right;">Unit Price</th>
                    <th style="padding: 10px 16px; text-align: right; border-top-right-radius: 6px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRowsHtml}
                </tbody>
                <tfoot>
                  <tr style="background-color: #f9fafb; font-weight: 700; font-size: 16px;">
                    <td colspan="3" style="padding: 14px 16px; text-align: right; border-top: 2px solid #111827;">Grand Total:</td>
                    <td style="padding: 14px 16px; text-align: right; color: #dc2626; border-top: 2px solid #111827;">${formattedTotal}</td>
                  </tr>
                </tfoot>
              </table>

              <!-- Action Link -->
              <div style="text-align: center; margin: 32px 0 16px 0;">
                <a href="${siteUrl}/admin/orders" target="_blank" style="display: inline-block; background-color: #dc2626; color: #ffffff; font-weight: 700; font-size: 15px; padding: 12px 28px; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.4);">
                  🚀 View Orders in Admin Panel
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 16px 24px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;">
              This is an automated notification sent to <strong>sriarumugampyropark.svks@gmail.com</strong>.<br>
              Sri Arumugam Pyro Park, Sivakasi.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Main function to send order notification email
 */
export async function sendOrderNotificationEmail(data: OrderEmailInput): Promise<{ success: boolean; error?: string }> {
  try {
    const targetEmail = process.env.NOTIFICATION_EMAIL || 'sriarumugampyropark.svks@gmail.com';
    const senderUser = process.env.SMTP_USER || 'sriarumugampyropark.svks@gmail.com';
    const pass = process.env.SMTP_PASS;

    if (!pass) {
      console.warn('[EMAIL WARNING] SMTP_PASS not configured in environment variables. Email notification skipped.');
      return { success: false, error: 'SMTP_PASS not configured' };
    }

    const transporter = createTransporter();
    const shortId = data.orderId.slice(0, 8).toUpperCase();
    const htmlContent = buildOrderEmailHtml(data);

    const info = await transporter.sendMail({
      from: `"Sri Arumugam Pyro Park" <${senderUser}>`,
      to: targetEmail,
      subject: `💥 New Order #${shortId} Received - ₹${data.totalAmount.toLocaleString('en-IN')} (${data.customerName})`,
      html: htmlContent,
    });

    console.log('[EMAIL SUCCESS] Order email sent to %s (Message ID: %s)', targetEmail, info.messageId);
    return { success: true };
  } catch (error: any) {
    console.error('[EMAIL ERROR] Failed to send order notification email:', error?.message || error);
    return { success: false, error: error?.message || 'Email dispatch failed' };
  }
}
