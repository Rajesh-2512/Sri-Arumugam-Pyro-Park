import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';

export interface PDFOrderItem {
  product_name: string;
  price: number;
  quantity: number;
}

export interface PDFOrderDetails {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  aadhar_pan?: string | null;
  paid_amount?: number | null;
  remaining_amount?: number | null;
  notes?: string | null;
  total_amount: number;
  status?: string;
  created_at: string;
  order_items: PDFOrderItem[];
}

export interface CustomGSTBillOptions {
  billNumber?: string;
  customerName?: string;
  phone?: string;
  address?: string;
  city?: string;
  pincode?: string;
  state?: string;
  gstinAadhar?: string | null;
  particulars?: string;
  totalAmount?: number;
  taxableAmount?: number;
  gstAmount?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  gstRate?: number;
  gstMode?: 'exclusive' | 'inclusive' | 'none';
  transport?: string;
  vehicleNumber?: string;
}

const SHOP_INFO = {
  name: 'SRI ARUMUGAM PYRO PARK',
  addressLine1: '4/2017, 56 House Colony,',
  addressLine2: 'Nalan Crackers Backside,',
  addressLine3: 'Sivakasi, TN, 626189',
  country: 'India',
  fullAddress: '4/2017, 56 House Colony, Nalan Crackers Backside, Sivakasi, Virudhunagar, Tamil Nadu - 626189',
  phone: '8682913516',
  email: 'sriarumugampyropark.svks@gmail.com',
  gstin: '33AAAFS5842K1Z9',
  hsn: '3604',
  bank: {
    name: 'KARUR VYSYA BANK LTD',
    branch: 'Sivakasi',
    accName: 'Sri Arumugam Pyro Park',
    accNumber: '1261155000137304',
    ifsc: 'KVBL0001261',
  },
  signatory: 'A. Marieswaran',
};

const loadImage = (src: string): Promise<HTMLImageElement | null> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(null);
      return;
    }
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
};

async function generateQrDataUrl(text: string): Promise<string | null> {
  try {
    return await QRCode.toDataURL(text, {
      margin: 1,
      width: 160,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
  } catch {
    return null;
  }
}

export function numberToWordsINR(amount: number): string {
  const rounded = Math.round(amount);
  if (rounded <= 0) return 'ZERO RUPEES ONLY';

  const ones = [
    '', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE',
    'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN',
    'SEVENTEEN', 'EIGHTEEN', 'NINETEEN',
  ];
  const tens = [
    '', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY',
  ];

  function convertChunk(n: number): string {
    let str = '';
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + ' HUNDRED ';
      n %= 100;
    }
    if (n > 0) {
      if (n < 20) {
        str += ones[n] + ' ';
      } else {
        str += tens[Math.floor(n / 10)] + (n % 10 > 0 ? '-' + ones[n % 10] : '') + ' ';
      }
    }
    return str.trim();
  }

  let num = rounded;
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const remainder = num;

  let words = '';
  if (crore > 0) words += convertChunk(crore) + ' CRORE ';
  if (lakh > 0) words += convertChunk(lakh) + ' LAKH ';
  if (thousand > 0) words += convertChunk(thousand) + ' THOUSAND ';
  if (remainder > 0) words += convertChunk(remainder) + ' ';

  return `${words.trim()} RUPEES ONLY`.toUpperCase();
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. STANDARD USER BILL INVOICE PDF GENERATOR
// Includes Shop From Address, Billing Address, Order Details, Table, QR & Signature
// ─────────────────────────────────────────────────────────────────────────────
export async function generateInvoicePDF(order: PDFOrderDetails, triggerDownload: boolean = true) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryDark = [27, 35, 66];
  const brandOrange = [234, 88, 12]; // #ea580c
  const slateGray = [100, 116, 139];

  const orderId = order.id.includes('-')
    ? order.id.split('-')[0].toUpperCase()
    : order.id.toUpperCase();

  const orderDateObj = new Date(order.created_at || Date.now());
  const formattedDate = orderDateObj.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });
  const formattedTime = orderDateObj.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const logoImg = await loadImage('/sriarumugamlogo.png');
  const signatureImg = await loadImage('/signature.png');
  const qrDataUrl = await generateQrDataUrl(
    `upi://pay?pa=krishnanhk55@okaxis&pn=Sri%20Arumugam%20Pyro%20Park&am=${order.total_amount}&cu=INR`
  );

  // Watermark across center
  doc.saveGraphicsState();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(38);
  doc.setTextColor(245, 230, 215);
  doc.text('Sri Arumuga Pyro Park', 38, 175, { angle: 30 });
  doc.restoreGraphicsState();

  // Top Header: Logo on Left, INVOICE on Right
  if (logoImg) {
    doc.addImage(logoImg, 'PNG', 14, 12, 46, 15);
  } else {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(brandOrange[0], brandOrange[1], brandOrange[2]);
    doc.text('SRI ARUMUGAM PYRO PARK', 14, 22);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(brandOrange[0], brandOrange[1], brandOrange[2]);
  doc.text('INVOICE', 196, 22, { align: 'right' });

  // Address & Order Details 3-Column Block
  const addressY = 36;

  // Column 1: From Address
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text('From Address:', 14, addressY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(SHOP_INFO.name, 14, addressY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(40, 40, 40);
  doc.text(SHOP_INFO.addressLine1, 14, addressY + 11);
  doc.text(SHOP_INFO.addressLine2, 14, addressY + 16);
  doc.text(SHOP_INFO.addressLine3, 14, addressY + 21);
  doc.text(SHOP_INFO.country, 14, addressY + 26);
  doc.text(`Phone: ${SHOP_INFO.phone}`, 14, addressY + 31);

  // Column 2: Billing Address
  const col2X = 80;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text('Billing Address:', col2X, addressY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(order.customer_name || 'Walk-in Counter Buyer', col2X, addressY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(40, 40, 40);
  const custAddrLines = doc.splitTextToSize(order.address || 'In-Store Counter', 55);
  doc.text(custAddrLines, col2X, addressY + 11);
  const nextY = addressY + 11 + custAddrLines.length * 4.5;
  doc.text(order.city || 'Sivakasi', col2X, nextY);
  doc.text(`Tamil Nadu-${order.pincode || '626123'}`, col2X, nextY + 4.5);
  doc.text(`Phone: ${order.phone || 'N/A'}`, col2X, nextY + 9);

  const aadharVal = order.aadhar_pan || order.notes?.match(/Aadhar\/PAN:\s*([^\s|]+)/)?.[1];
  if (aadharVal) {
    doc.text(`Aadhar No:${aadharVal}`, col2X, nextY + 13.5);
  }

  // Column 3: Order Details
  const col3X = 145;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text(`Order ID : #${orderId}`, col3X, addressY);
  doc.text(`Order Date : ${formattedDate},`, col3X, addressY + 5);
  doc.text(`${formattedTime}`, col3X, addressY + 9.5);

  // Table of Items
  const itemsList = order.order_items && order.order_items.length > 0
    ? order.order_items
    : [
        {
          product_name: 'Combo Box Pack / Order Package',
          quantity: 1,
          price: order.total_amount,
        },
      ];

  const tableHead = [['S.No', 'Product Name', 'Quantity', 'Price (Rs.)', 'Amount (Rs.)']];
  const tableData = itemsList.map((item, index) => {
    const itemPrice = Number(item.price || order.total_amount || 0);
    const itemQty = Number(item.quantity || 1);
    const total = itemPrice * itemQty;

    return [
      index + 1,
      item.product_name || 'Combo Box Pack',
      itemQty,
      `Rs. ${itemPrice.toFixed(2)}`,
      `Rs. ${total.toFixed(2)}`,
    ];
  });

  const tableStartY = Math.max(addressY + 36, nextY + (aadharVal ? 18 : 14));

  autoTable(doc, {
    startY: tableStartY,
    head: tableHead,
    body: tableData,
    theme: 'plain',
    headStyles: {
      textColor: [234, 88, 12],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'left',
      cellPadding: { top: 3, bottom: 3, left: 2, right: 2 },
    },
    columnStyles: {
      0: { cellWidth: 14, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 22, halign: 'center' },
      3: { cellWidth: 32, halign: 'right' },
      4: { cellWidth: 35, halign: 'right' },
    },
    styles: {
      fontSize: 9,
      textColor: [0, 0, 0],
      cellPadding: 3,
    },
    didDrawCell: (data) => {
      // Top line and bottom line for header row
      if (data.row.index === -1) {
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.6);
        doc.line(14, data.cell.y + data.cell.height, 196, data.cell.y + data.cell.height);
      }
    },
  });

  const tableFinalY = (doc as any).lastAutoTable.finalY + 4;

  // Divider line after table body
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.4);
  doc.line(14, tableFinalY, 196, tableFinalY);

  // Total Amount Row
  const totalY = tableFinalY + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('Total Amount', 145, totalY, { align: 'right' });
  doc.text(`Rs. ${order.total_amount.toFixed(2)}`, 196, totalY, { align: 'right' });

  // Additional Details & QR & Terms (Bottom Left)
  let bottomY = totalY + 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Additional Details', 14, bottomY);
  doc.setLineWidth(0.3);
  doc.line(14, bottomY + 1, 45, bottomY + 1);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(order.notes || 'Safty and Happy Diwali', 14, bottomY + 6);

  // UPI QR Code
  const qrY = bottomY + 10;
  if (qrDataUrl) {
    doc.addImage(qrDataUrl, 'PNG', 14, qrY, 24, 24);
  }

  // Terms and Conditions
  const termsY = qrY + 28;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Terms and Conditions', 14, termsY);
  doc.line(14, termsY + 1, 52, termsY + 1);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('• This is system generated invoice.', 14, termsY + 6);

  // Signature Block (Bottom Right)
  const sigY = bottomY + 14;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('Signature', 196, sigY, { align: 'right' });

  if (signatureImg) {
    doc.addImage(signatureImg, 'PNG', 152, sigY + 2, 44, 14);
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(SHOP_INFO.signatory, 196, sigY + 19, { align: 'right' });

  if (triggerDownload) {
    doc.save(`Order_Invoice_${orderId}.pdf`);
  }

  return doc;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. FORMAL GST TAX INVOICE PDF GENERATOR (2 COPIES: ORIGINAL & DUPLICATE)
// Generates Page 1: ORIGINAL FOR RECIPIENT, Page 2: DUPLICATE COPY
// Includes complete Shop Address, Customer Details, Order Details, HSN 3604,
// CGST/SGST/IGST breakdown, Bank details, Terms & Conditions, and Signature.
// ─────────────────────────────────────────────────────────────────────────────
export async function generateGSTInvoicePDF(
  order: PDFOrderDetails,
  triggerDownload: boolean = true,
  customOptions?: CustomGSTBillOptions
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const orderId = order.id.includes('-')
    ? order.id.split('-')[0].toUpperCase()
    : order.id.toUpperCase();

  const shortId = customOptions?.billNumber
    ? customOptions.billNumber.replace(/^GST-/, '')
    : orderId;

  const invoiceNumber = customOptions?.billNumber || `GST-${shortId}`;
  const orderDateObj = new Date(order.created_at || Date.now());
  const formattedDate = orderDateObj.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const pin = (customOptions?.pincode || order.pincode || '').trim();
  const stateName = customOptions?.state || (pin.startsWith('60') || /^6[0-4]\d{4}$/.test(pin) ? 'Tamil Nadu' : 'Inter-State Transport');
  const isTN = stateName.toLowerCase().includes('tamil') || (!pin.startsWith('605') && /^6[0-4]\d{4}$/.test(pin));

  const gstRate = customOptions?.gstRate ?? 18;
  const gstMode = customOptions?.gstMode ?? 'exclusive';

  let grandTotal = 0;
  let taxableTotal = 0;
  let totalGst = 0;

  if (customOptions?.taxableAmount !== undefined && customOptions?.totalAmount !== undefined && customOptions?.gstAmount !== undefined) {
    taxableTotal = Number(customOptions.taxableAmount);
    totalGst = Number(customOptions.gstAmount);
    grandTotal = Number(customOptions.totalAmount);
  } else if (gstMode === 'exclusive') {
    const rawTaxable = Number(customOptions?.taxableAmount ?? customOptions?.totalAmount ?? order.total_amount ?? 0);
    taxableTotal = Math.round(rawTaxable * 100) / 100;
    totalGst = Math.round((taxableTotal * (gstRate / 100)) * 100) / 100;
    grandTotal = Math.round((taxableTotal + totalGst) * 100) / 100;
  } else {
    grandTotal = Number(customOptions?.totalAmount ?? order.total_amount ?? 0);
    taxableTotal = Math.round((grandTotal / (1 + gstRate / 100)) * 100) / 100;
    totalGst = Math.round((grandTotal - taxableTotal) * 100) / 100;
  }

  const cgst = customOptions?.cgst !== undefined ? Number(customOptions.cgst) : (isTN ? Math.round((totalGst / 2) * 100) / 100 : 0);
  const sgst = customOptions?.sgst !== undefined ? Number(customOptions.sgst) : (isTN ? Math.round((totalGst / 2) * 100) / 100 : 0);
  const igst = customOptions?.igst !== undefined ? Number(customOptions.igst) : (!isTN ? totalGst : 0);

  const logoImg = await loadImage('/sriarumugamlogo.png');
  const signatureImg = await loadImage('/signature.png');

  const custName = customOptions?.customerName || order.customer_name || 'Walk-in Counter Buyer';
  const custPhone = customOptions?.phone || order.phone || '';
  const custAddress = customOptions?.address || order.address || 'In-Store Counter';
  const custCity = customOptions?.city || order.city || 'Sivakasi';
  const custPincode = customOptions?.pincode || order.pincode || '626123';
  const aadharNo = customOptions?.gstinAadhar || order.aadhar_pan || order.notes?.match(/Aadhar\/PAN:\s*([^\s|]+)/)?.[1] || '';

  const transport = customOptions?.transport || 'Road Transport / Speed Courier';
  const vehicleNumber = customOptions?.vehicleNumber || 'TN84Z0587 / Parcel';

  // Helper to draw an entire single GST invoice copy
  const renderGstInvoicePage = (copyLabel: 'ORIGINAL FOR RECIPIENT' | 'DUPLICATE COPY') => {
    const leftMargin = 10;
    const rightMargin = 200;
    const contentWidth = rightMargin - leftMargin;

    // Top Header: Shop Info (Left) & Contact Details (Right)
    let topY = 10;
    if (logoImg) {
      doc.addImage(logoImg, 'PNG', leftMargin, topY, 40, 14);
      topY += 15;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(SHOP_INFO.name, leftMargin, topY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(60, 60, 60);
    doc.text(SHOP_INFO.addressLine1, leftMargin, topY + 4);
    doc.text(SHOP_INFO.addressLine2, leftMargin, topY + 7.5);
    doc.text('Sivakasi, Virudhunagar, Tamil Nadu - 626189', leftMargin, topY + 11);

    // Header Right
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(0, 0, 0);
    doc.text(`Name : ${SHOP_INFO.name}`, rightMargin, 12, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Phone : ${SHOP_INFO.phone}`, rightMargin, 16.5, { align: 'right' });
    doc.text(`Email : ${SHOP_INFO.email}`, rightMargin, 21, { align: 'right' });

    // Main Header Bar (Blue Theme)
    const barY = Math.max(topY + 14, 26);
    const barHeight = 8;

    doc.setDrawColor(2, 132, 199); // Sky-600 border
    doc.setLineWidth(0.6);
    doc.rect(leftMargin, barY, contentWidth, barHeight);

    // Vertical dividers in bar
    doc.line(leftMargin + 65, barY, leftMargin + 65, barY + barHeight);
    doc.line(leftMargin + 130, barY, leftMargin + 130, barY + barHeight);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(0, 0, 0);
    doc.text(`GSTIN : ${SHOP_INFO.gstin}`, leftMargin + 3, barY + 5.5);

    doc.setFontSize(11);
    doc.setTextColor(2, 132, 199);
    doc.text('TAX INVOICE', leftMargin + 97.5, barY + 5.8, { align: 'center' });

    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(copyLabel, rightMargin - 3, barY + 5.5, { align: 'right' });

    // Customer & Order Details Box
    const detailsY = barY + barHeight;
    const detailsHeight = 34;

    doc.setDrawColor(2, 132, 199);
    doc.setLineWidth(0.5);
    doc.rect(leftMargin, detailsY, contentWidth, detailsHeight);

    // Center divider
    const midX = leftMargin + 95;
    doc.line(midX, detailsY, midX, detailsY + detailsHeight);

    // Left Half: Customer Detail
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text('Customer Detail', leftMargin + 35, detailsY + 4.5, { align: 'center' });
    doc.line(leftMargin, detailsY + 6, midX, detailsY + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('M/S', leftMargin + 3, detailsY + 10.5);
    doc.text('Address', leftMargin + 3, detailsY + 15);
    doc.text('Phone', leftMargin + 3, detailsY + 23);
    doc.text('GSTIN', leftMargin + 3, detailsY + 27);
    doc.text('Place of Supply', leftMargin + 3, detailsY + 31);

    doc.setFont('helvetica', 'normal');
    doc.text(`: ${custName}`, leftMargin + 25, detailsY + 10.5);
    const splitAddr = doc.splitTextToSize(`${custAddress}, ${custCity} - ${custPincode}`, 65);
    doc.text(`: ${splitAddr[0] || ''}`, leftMargin + 25, detailsY + 15);
    if (splitAddr[1]) {
      doc.text(`  ${splitAddr[1]}`, leftMargin + 25, detailsY + 18.5);
    }
    doc.text(`: ${custPhone}`, leftMargin + 25, detailsY + 23);
    doc.setFont('helvetica', 'bold');
    doc.text(`: ${aadharNo || 'N/A'}`, leftMargin + 25, detailsY + 27);
    doc.setFont('helvetica', 'normal');
    doc.text(`: ${stateName} (${isTN ? '33' : 'Inter-State'})`, leftMargin + 25, detailsY + 31);

    // Right Half: Invoice & Transport Meta (Without Due Date and Vehicle Number)
    const rowH = detailsHeight / 3;
    doc.line(midX, detailsY + rowH, rightMargin, detailsY + rowH);
    doc.line(midX, detailsY + rowH * 2, rightMargin, detailsY + rowH * 2);

    // Row 1: Invoice No & Invoice Date
    doc.line(midX + 45, detailsY, midX + 45, detailsY + rowH);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('Invoice No.', midX + 3, detailsY + 7);
    doc.setFont('helvetica', 'normal');
    doc.text(invoiceNumber, midX + 22, detailsY + 7);

    doc.setFont('helvetica', 'bold');
    doc.text('Invoice Date', midX + 48, detailsY + 7);
    doc.setFont('helvetica', 'normal');
    doc.text(formattedDate, midX + 72, detailsY + 7);

    // Row 2: Order Ref
    const displayOrderRef = order.id.startsWith('SAPP')
      ? order.id
      : `#${order.id.slice(-8).toUpperCase()}`;
    doc.setFont('helvetica', 'bold');
    doc.text('Order Ref', midX + 3, detailsY + rowH + 7);
    doc.setFont('helvetica', 'normal');
    doc.text(displayOrderRef, midX + 35, detailsY + rowH + 7);

    // Row 3: Transport
    doc.setFont('helvetica', 'bold');
    doc.text('Transport', midX + 3, detailsY + rowH * 2 + 7);
    doc.setFont('helvetica', 'normal');
    doc.text(transport, midX + 35, detailsY + rowH * 2 + 7);

    // Itemized GST Table
    const tableStartY = detailsY + detailsHeight;

    const tableHead = isTN
      ? [
          [
            { content: 'Sr.\nNo.', rowSpan: 2 },
            { content: 'Name of Product / Service', rowSpan: 2 },
            { content: 'HSN / SAC', rowSpan: 2 },
            { content: 'Qty', rowSpan: 2 },
            { content: 'Rate', rowSpan: 2 },
            { content: 'Taxable Value', rowSpan: 2 },
            { content: 'CGST', colSpan: 2 },
            { content: 'SGST', colSpan: 2 },
            { content: 'Total', rowSpan: 2 },
          ],
          ['%', 'Amount', '%', 'Amount'],
        ]
      : [
          [
            { content: 'Sr.\nNo.', rowSpan: 2 },
            { content: 'Name of Product / Service', rowSpan: 2 },
            { content: 'HSN / SAC', rowSpan: 2 },
            { content: 'Qty', rowSpan: 2 },
            { content: 'Rate', rowSpan: 2 },
            { content: 'Taxable Value', rowSpan: 2 },
            { content: 'IGST', colSpan: 2 },
            { content: 'Total', rowSpan: 2 },
          ],
          ['%', 'Amount'],
        ];

    const particularsTitle = customOptions?.particulars || 'Assorted Fireworks Variety Pack (HSN 3604)';
    let totalQty = 0;
    let tableData: any[][] = [];

    if (customOptions?.particulars || !order.order_items || order.order_items.length === 0) {
      totalQty = 1;
      if (isTN) {
        tableData = [
          [
            '1',
            particularsTitle,
            '3604',
            '1.00 BOX',
            taxableTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
            taxableTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
            (gstRate / 2).toFixed(2),
            cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
            (gstRate / 2).toFixed(2),
            sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
            grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
          ],
        ];
      } else {
        tableData = [
          [
            '1',
            particularsTitle,
            '3604',
            '1.00 BOX',
            taxableTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
            taxableTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
            gstRate.toFixed(2),
            igst.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
            grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
          ],
        ];
      }
    } else {
      tableData = order.order_items.map((item, idx) => {
        const qty = Number(item.quantity || 1);
        totalQty += qty;
        const itemUnitPrice = Number(item.price || 0);

        let itemTaxable = 0;
        let itemTax = 0;
        let itemTotal = 0;

        if (gstMode === 'exclusive') {
          itemTaxable = itemUnitPrice * qty;
          itemTax = Math.round((itemTaxable * (gstRate / 100)) * 100) / 100;
          itemTotal = Math.round((itemTaxable + itemTax) * 100) / 100;
        } else {
          itemTotal = itemUnitPrice * qty;
          itemTaxable = Math.round((itemTotal / (1 + gstRate / 100)) * 100) / 100;
          itemTax = Math.round((itemTotal - itemTaxable) * 100) / 100;
        }

        const itemCgst = isTN ? Math.round((itemTax / 2) * 100) / 100 : 0;
        const itemSgst = isTN ? Math.round((itemTax / 2) * 100) / 100 : 0;

        if (isTN) {
          return [
            String(idx + 1),
            item.product_name || 'Fireworks Item',
            '3604',
            `${qty}.00`,
            itemUnitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
            itemTaxable.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
            (gstRate / 2).toFixed(2),
            itemCgst.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
            (gstRate / 2).toFixed(2),
            itemSgst.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
            itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
          ];
        } else {
          return [
            String(idx + 1),
            item.product_name || 'Fireworks Item',
            '3604',
            `${qty}.00`,
            itemUnitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
            itemTaxable.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
            gstRate.toFixed(2),
            itemTax.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
            itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
          ];
        }
      });
    }

    // Total Row
    const totalRow = isTN
      ? [
          { content: 'Total', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } },
          { content: `${totalQty}.00`, styles: { halign: 'center', fontStyle: 'bold' } },
          { content: '', styles: { halign: 'right' } },
          { content: taxableTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }), styles: { halign: 'right', fontStyle: 'bold' } },
          { content: '', styles: { halign: 'center' } },
          { content: cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 }), styles: { halign: 'right', fontStyle: 'bold' } },
          { content: '', styles: { halign: 'center' } },
          { content: sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 }), styles: { halign: 'right', fontStyle: 'bold' } },
          { content: grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }), styles: { halign: 'right', fontStyle: 'bold' } },
        ]
      : [
          { content: 'Total', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } },
          { content: `${totalQty}.00`, styles: { halign: 'center', fontStyle: 'bold' } },
          { content: '', styles: { halign: 'right' } },
          { content: taxableTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }), styles: { halign: 'right', fontStyle: 'bold' } },
          { content: '', styles: { halign: 'center' } },
          { content: igst.toLocaleString('en-IN', { minimumFractionDigits: 2 }), styles: { halign: 'right', fontStyle: 'bold' } },
          { content: grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }), styles: { halign: 'right', fontStyle: 'bold' } },
        ];

    autoTable(doc, {
      startY: tableStartY,
      head: tableHead as any,
      body: [...tableData, totalRow as any],
      theme: 'grid',
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        lineColor: [2, 132, 199],
        lineWidth: 0.4,
        fontSize: 7,
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle',
      },
      bodyStyles: {
        fontSize: 7,
        lineColor: [2, 132, 199],
        lineWidth: 0.3,
        cellPadding: 2,
      },
      columnStyles: isTN
        ? {
            0: { cellWidth: 8, halign: 'center' },
            1: { cellWidth: 'auto', halign: 'left' },
            2: { cellWidth: 15, halign: 'center' },
            3: { cellWidth: 15, halign: 'center' },
            4: { cellWidth: 18, halign: 'right' },
            5: { cellWidth: 20, halign: 'right' },
            6: { cellWidth: 11, halign: 'center' },
            7: { cellWidth: 16, halign: 'right' },
            8: { cellWidth: 11, halign: 'center' },
            9: { cellWidth: 16, halign: 'right' },
            10: { cellWidth: 20, halign: 'right' },
          }
        : {
            0: { cellWidth: 8, halign: 'center' },
            1: { cellWidth: 'auto', halign: 'left' },
            2: { cellWidth: 18, halign: 'center' },
            3: { cellWidth: 18, halign: 'center' },
            4: { cellWidth: 22, halign: 'right' },
            5: { cellWidth: 25, halign: 'right' },
            6: { cellWidth: 15, halign: 'center' },
            7: { cellWidth: 22, halign: 'right' },
            8: { cellWidth: 25, halign: 'right' },
          },
      margin: { left: leftMargin, right: 10 },
    });

    const finalY = (doc as any).lastAutoTable.finalY;

    // Bottom Summary & Declaration Box
    const bottomBoxHeight = 78;
    doc.setDrawColor(2, 132, 199);
    doc.setLineWidth(0.5);
    doc.rect(leftMargin, finalY, contentWidth, bottomBoxHeight);

    // Split Left and Right
    const summarySplitX = leftMargin + 115;
    doc.line(summarySplitX, finalY, summarySplitX, finalY + bottomBoxHeight);

    // ── LEFT SIDE: Total in words, Bank Details, Terms ──
    let leftY = finalY + 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(0, 0, 0);
    doc.text('Total in words', leftMargin + 2, leftY);
    leftY += 4.5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text(numberToWordsINR(grandTotal), leftMargin + 2, leftY);

    // Bank Details
    leftY += 6;
    doc.setDrawColor(220, 220, 220);
    doc.line(leftMargin + 2, leftY, summarySplitX - 2, leftY);
    leftY += 4;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('Name', leftMargin + 2, leftY);
    doc.setFont('helvetica', 'normal');
    doc.text(`: ${SHOP_INFO.bank.name}`, leftMargin + 22, leftY);

    leftY += 4;
    doc.setFont('helvetica', 'bold');
    doc.text('Branch', leftMargin + 2, leftY);
    doc.setFont('helvetica', 'normal');
    doc.text(`: ${SHOP_INFO.bank.branch}`, leftMargin + 22, leftY);

    leftY += 4;
    doc.setFont('helvetica', 'bold');
    doc.text('Acc. Name', leftMargin + 2, leftY);
    doc.setFont('helvetica', 'normal');
    doc.text(`: ${SHOP_INFO.bank.accName}`, leftMargin + 22, leftY);

    leftY += 4;
    doc.setFont('helvetica', 'bold');
    doc.text('Acc. Number', leftMargin + 2, leftY);
    doc.setFont('helvetica', 'normal');
    doc.text(`: ${SHOP_INFO.bank.accNumber}`, leftMargin + 22, leftY);

    leftY += 4;
    doc.setFont('helvetica', 'bold');
    doc.text('IFSC', leftMargin + 2, leftY);
    doc.setFont('helvetica', 'normal');
    doc.text(`: ${SHOP_INFO.bank.ifsc}`, leftMargin + 22, leftY);

    // Terms and Conditions
    leftY += 5;
    doc.line(leftMargin + 2, leftY, summarySplitX - 2, leftY);
    leftY += 4;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('Terms and Conditions', leftMargin + 2, leftY);

    leftY += 3.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(60, 60, 60);
    doc.text('• Subject to Sivakasi Jurisdiction.', leftMargin + 2, leftY);
    leftY += 3;
    doc.text('• Our Responsibility Ceases as soon as goods leaves our Premises.', leftMargin + 2, leftY);
    leftY += 3;
    doc.text('• Goods once sold will not taken back.', leftMargin + 2, leftY);
    leftY += 3;
    doc.text('• Delivery Ex-Premises.', leftMargin + 2, leftY);

    // ── RIGHT SIDE: Tax Computation & Signatures ──
    let rightY = finalY + 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(0, 0, 0);

    doc.text('Taxable Amount', summarySplitX + 3, rightY);
    doc.text(taxableTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 }), rightMargin - 3, rightY, { align: 'right' });
    rightY += 4;

    if (isTN) {
      doc.text(`Add : CGST (${(gstRate / 2)}%)`, summarySplitX + 3, rightY);
      doc.text(cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 }), rightMargin - 3, rightY, { align: 'right' });
      rightY += 4;

      doc.text(`Add : SGST (${(gstRate / 2)}%)`, summarySplitX + 3, rightY);
      doc.text(sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 }), rightMargin - 3, rightY, { align: 'right' });
      rightY += 4;
    } else {
      doc.text(`Add : IGST (${gstRate}%)`, summarySplitX + 3, rightY);
      doc.text(igst.toLocaleString('en-IN', { minimumFractionDigits: 2 }), rightMargin - 3, rightY, { align: 'right' });
      rightY += 4;
    }

    doc.text('Total Tax', summarySplitX + 3, rightY);
    doc.text(totalGst.toLocaleString('en-IN', { minimumFractionDigits: 2 }), rightMargin - 3, rightY, { align: 'right' });
    rightY += 5;

    // Total Amount Box
    doc.setDrawColor(2, 132, 199);
    doc.line(summarySplitX, rightY - 1, rightMargin, rightY - 1);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('Total Amount After Tax', summarySplitX + 3, rightY + 3);
    doc.text(`Rs. ${grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, rightMargin - 3, rightY + 3, { align: 'right' });
    doc.line(summarySplitX, rightY + 5.5, rightMargin, rightY + 5.5);

    rightY += 9;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('(E & O.E.)', rightMargin - 3, rightY, { align: 'right' });

    rightY += 3.5;
    doc.text('Certified that the particulars given above are true and correct.', summarySplitX + 3, rightY);

    rightY += 4;
    doc.setFont('helvetica', 'bold');
    doc.text(`For ${SHOP_INFO.name}`, rightMargin - 3, rightY, { align: 'right' });

    // Signature
    rightY += 3;
    if (signatureImg) {
      doc.addImage(signatureImg, 'PNG', rightMargin - 38, rightY, 34, 11);
    }
    rightY += 13;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text('Authorised Signatory', rightMargin - 3, rightY, { align: 'right' });
  };

  // ── PAGE 1: ORIGINAL FOR RECIPIENT ──
  renderGstInvoicePage('ORIGINAL FOR RECIPIENT');

  // ── PAGE 2: DUPLICATE COPY ──
  doc.addPage();
  renderGstInvoicePage('DUPLICATE COPY');

  if (triggerDownload) {
    doc.save(`GST_Invoice_${shortId}.pdf`);
  }

  return doc;
}
