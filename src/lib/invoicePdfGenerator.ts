import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

export async function generateInvoicePDF(order: PDFOrderDetails, triggerDownload: boolean = true) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryDark = [27, 35, 66]; // #1b2342
  const amberColor = [217, 119, 6]; // Amber-600
  const brandOrange = [234, 88, 12]; // #ea580c
  const slateGray = [100, 116, 139]; // Slate-500
  const lightBg = [248, 250, 252];

  const shortId = order.id.slice(-8).toUpperCase();
  const formattedDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Load logo & signature images asynchronously
  const logoImg = await loadImage('/sriarumugamlogo.png');
  const signatureImg = await loadImage('/signature.png');

  // --- HEADER SECTION ---
  let headerY = 20;

  if (logoImg) {
    doc.addImage(logoImg, 'PNG', 14, 10, 48, 16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(amberColor[0], amberColor[1], amberColor[2]);
    doc.text('DIRECT SIVAKASI FACTORY OUTLET | OFFICIAL ORDER RECEIPT', 14, 30);
    headerY = 32;
  } else {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
    doc.text('SRI ARUMUGAM PYRO PARK', 14, 20);

    doc.setFontSize(9);
    doc.setTextColor(amberColor[0], amberColor[1], amberColor[2]);
    doc.text('DIRECT SIVAKASI FACTORY OUTLET | OFFICIAL ORDER RECEIPT', 14, 26);
    headerY = 28;
  }

  // Invoice Meta (Top Right)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text(`INVOICE #: #${shortId}`, 196, 20, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text(`Date: ${formattedDate}`, 196, 26, { align: 'right' });

  // Horizontal Divider Line
  doc.setLineWidth(0.5);
  doc.setDrawColor(226, 232, 240);
  doc.line(14, headerY + 2, 196, headerY + 2);

  const customerBoxY = headerY + 6;
  const hasAadhar = Boolean(order.aadhar_pan || (order.notes && order.notes.includes('Aadhar')));
  const boxHeight = hasAadhar ? 34 : 28;

  // --- BILLED TO / CUSTOMER DETAILS BOX ---
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(14, customerBoxY, 182, boxHeight, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, customerBoxY, 182, boxHeight, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(amberColor[0], amberColor[1], amberColor[2]);
  doc.text('BILLED TO / CUSTOMER DETAILS:', 18, customerBoxY + 7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text(order.customer_name || 'Walk-in Counter Buyer', 18, customerBoxY + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text(`Mobile: ${order.phone ? '+91 ' + order.phone : 'N/A'}`, 18, customerBoxY + 18);
  doc.text(`Address: ${order.address || 'In-Store Counter'}, ${order.city || 'Sivakasi'} - ${order.pincode || '626123'}`, 18, customerBoxY + 23);

  if (hasAadhar) {
    const aadharVal = order.aadhar_pan || order.notes?.match(/Aadhar\/PAN:\s*([^\s|]+)/)?.[1] || '';
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(brandOrange[0], brandOrange[1], brandOrange[2]);
    doc.text(`Aadhar / PAN No: ${aadharVal}`, 18, customerBoxY + 29);
  }

  // --- TABLE GENERATION ---
  const tableHead = [['#', 'Item Name', 'Qty', 'Unit Price (Rs.)', 'Total Amount (Rs.)']];
  
  const itemsList = order.order_items && order.order_items.length > 0
    ? order.order_items
    : [
        {
          product_name: 'Combo Box Pack / Order Package',
          quantity: 1,
          price: order.total_amount,
        },
      ];

  const tableData = itemsList.map((item, index) => {
    const itemPrice = Number(item.price || order.total_amount || 0);
    const itemQty = Number(item.quantity || 1);
    const total = itemPrice * itemQty;

    return [
      index + 1,
      item.product_name || 'Combo Box Pack',
      itemQty,
      itemPrice.toFixed(2),
      total.toFixed(2),
    ];
  });

  autoTable(doc, {
    startY: customerBoxY + boxHeight + 5,
    head: tableHead,
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [234, 88, 12], // Brand Orange
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'left',
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
      3: { cellWidth: 35, halign: 'right' },
      4: { cellWidth: 40, halign: 'right', fontStyle: 'bold' },
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 6;

  // --- GRAND TOTAL BANNER ---
  let breakdownY = finalY;

  const labelText = 'OFFICIAL INVOICE RECEIPT';

  doc.setFillColor(255, 247, 237); // Soft Orange Fill
  doc.roundedRect(14, breakdownY, 182, 18, 3, 3, 'F');
  doc.setLineWidth(0.4);
  doc.setDrawColor(brandOrange[0], brandOrange[1], brandOrange[2]);
  doc.roundedRect(14, breakdownY, 182, 18, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text(labelText, 20, breakdownY + 11);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(brandOrange[0], brandOrange[1], brandOrange[2]);
  doc.text(`Grand Total: Rs. ${order.total_amount.toFixed(2)}`, 190, breakdownY + 11.5, { align: 'right' });

  // --- SIGNATURE SECTION AT THE BOTTOM ---
  const signatureSectionY = breakdownY + 25;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('For SRI ARUMUGAM PYRO PARK', 190, signatureSectionY, { align: 'right' });

  if (signatureImg) {
    doc.addImage(signatureImg, 'PNG', 145, signatureSectionY + 2, 48, 16);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('Authorized Signature: A. Marieswaran', 190, signatureSectionY + 19, { align: 'right' });

  // --- FOOTER SECTION ---
  const footerY = signatureSectionY + 24;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('Thank you for shopping with Sri Arumugam Pyro Park!', 105, footerY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text('Direct Sivakasi Factory Dispatch. Official Computer Generated Invoice.', 105, footerY + 4, { align: 'center' });

  if (triggerDownload) {
    doc.save(`Order_Invoice_${shortId}.pdf`);
  }

  return doc;
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
}

// --- GST AUDIT & PARCEL TRANSPORT INVOICE PDF GENERATOR ---
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

  const primaryDark = [27, 35, 66]; // #1b2342
  const amberColor = [217, 119, 6];
  const brandOrange = [234, 88, 12];
  const slateGray = [100, 116, 139];
  const lightBg = [248, 250, 252];

  const shortId = customOptions?.billNumber
    ? customOptions.billNumber.replace(/^GST-/, '')
    : order.id.slice(-8).toUpperCase();

  const formattedDate = new Date(order.created_at || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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

  // --- HEADER SECTION ---
  let headerY = 20;

  if (logoImg) {
    doc.addImage(logoImg, 'PNG', 14, 10, 44, 15);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(amberColor[0], amberColor[1], amberColor[2]);
    doc.text(`GSTIN: 33AAAFS5842K1Z9 | HSN CODE: 3604 (FIREWORKS)`, 14, 29);
    headerY = 31;
  } else {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
    doc.text('SRI ARUMUGAM PYRO PARK', 14, 18);

    doc.setFontSize(8);
    doc.setTextColor(amberColor[0], amberColor[1], amberColor[2]);
    doc.text(`GSTIN: 33AAAFS5842K1Z9 | HSN CODE: 3604 (FIREWORKS)`, 14, 24);
    headerY = 26;
  }

  // GST Invoice Meta (Top Right)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(brandOrange[0], brandOrange[1], brandOrange[2]);
  doc.text('TAX INVOICE / AUDIT BILL', 196, 18, { align: 'right' });

  doc.setFontSize(9);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text(`GST BILL #: GST-${shortId}`, 196, 24, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text(`Date: ${formattedDate}`, 196, 29, { align: 'right' });

  // Divider Line
  doc.setLineWidth(0.5);
  doc.setDrawColor(226, 232, 240);
  doc.line(14, headerY + 2, 196, headerY + 2);

  const customerBoxY = headerY + 5;
  const aadharNo = customOptions?.gstinAadhar || order.aadhar_pan || order.notes?.match(/Aadhar\/PAN:\s*([^\s|]+)/)?.[1] || '';
  const hasAadhar = Boolean(aadharNo);
  const boxHeight = hasAadhar ? 32 : 26;

  const custName = customOptions?.customerName || order.customer_name || 'Walk-in Counter Buyer';
  const custPhone = customOptions?.phone || order.phone || '';
  const custAddress = customOptions?.address || order.address || 'In-Store Counter';
  const custCity = customOptions?.city || order.city || 'Sivakasi';
  const custPincode = customOptions?.pincode || order.pincode || '626123';

  // BILLED TO BOX
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(14, customerBoxY, 182, boxHeight, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, customerBoxY, 182, boxHeight, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(amberColor[0], amberColor[1], amberColor[2]);
  doc.text('BUYER & RECIPIENT DETAILS :', 18, customerBoxY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text(custName, 18, customerBoxY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text(`Mobile: ${custPhone ? '+91 ' + custPhone : 'N/A'} | State: ${isTN ? 'Tamil Nadu (State Code 33)' : 'Inter-State Transport'}`, 18, customerBoxY + 17);
  doc.text(`Address: ${custAddress}, ${custCity} - ${custPincode}`, 18, customerBoxY + 22);

  if (hasAadhar) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(brandOrange[0], brandOrange[1], brandOrange[2]);
    doc.text(`Aadhar / PAN / GST: ${aadharNo}`, 18, customerBoxY + 27.5);
  }

  // --- GST ITEM TABLE ---
  const tableHead = [['#', 'Item Particulars & HSN', 'Qty', 'Taxable Val', `GST (${gstRate}%)`, 'Total (Rs.)']];

  // If custom options or single particulars entered, display clean single line item
  const particularsTitle = customOptions?.particulars || 'Assorted Crackers Variety Pack (HSN 3604)';
  
  let tableData: any[][] = [];

  if (customOptions?.particulars || !order.order_items || order.order_items.length === 0) {
    tableData = [
      [
        1,
        particularsTitle.includes('HSN 3604') ? particularsTitle : `${particularsTitle} (HSN 3604)`,
        1,
        `Rs. ${taxableTotal.toFixed(2)}`,
        `Rs. ${totalGst.toFixed(2)}`,
        `Rs. ${grandTotal.toFixed(2)}`,
      ]
    ];
  } else {
    tableData = order.order_items.map((item, index) => {
      const itemUnitPrice = Number(item.price || 0);
      const qty = Number(item.quantity || 1);
      
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

      return [
        index + 1,
        `${item.product_name || 'Firecracker Variety'} (HSN 3604)`,
        qty,
        `Rs. ${itemTaxable.toFixed(2)}`,
        `Rs. ${itemTax.toFixed(2)}`,
        `Rs. ${itemTotal.toFixed(2)}`,
      ];
    });
  }

  autoTable(doc, {
    startY: customerBoxY + boxHeight + 4,
    head: tableHead,
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [27, 35, 66], // Slate Dark
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'left',
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 16, halign: 'center', fontStyle: 'bold' },
      3: { cellWidth: 32, halign: 'right' },
      4: { cellWidth: 32, halign: 'right' },
      5: { cellWidth: 35, halign: 'right', fontStyle: 'bold' },
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 2.5,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 4;

  // --- GST TAX COMPUTATION BREAKDOWN BOX ---
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(100, finalY, 96, isTN ? 32 : 26, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(100, finalY, 96, isTN ? 32 : 26, 2, 2, 'D');

  let taxY = finalY + 5;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);

  doc.text('Taxable Subtotal:', 104, taxY);
  doc.text(`Rs. ${taxableTotal.toFixed(2)}`, 190, taxY, { align: 'right' });
  taxY += 5;

  const halfRate = gstRate / 2;

  if (isTN) {
    doc.text(`CGST (${halfRate}%):`, 104, taxY);
    doc.text(`Rs. ${cgst.toFixed(2)}`, 190, taxY, { align: 'right' });
    taxY += 5;

    doc.text(`SGST (${halfRate}%):`, 104, taxY);
    doc.text(`Rs. ${sgst.toFixed(2)}`, 190, taxY, { align: 'right' });
    taxY += 5;
  } else {
    doc.text(`IGST (${gstRate}%):`, 104, taxY);
    doc.text(`Rs. ${igst.toFixed(2)}`, 190, taxY, { align: 'right' });
    taxY += 5;
  }

  doc.setDrawColor(203, 213, 225);
  doc.line(104, taxY - 1, 192, taxY - 1);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(brandOrange[0], brandOrange[1], brandOrange[2]);
  doc.text(gstMode === 'exclusive' ? 'Grand Total (Amount + GST):' : 'Grand Total (Incl. GST):', 104, taxY + 4);
  doc.text(`Rs. ${grandTotal.toFixed(2)}`, 190, taxY + 4, { align: 'right' });

  // TRANSPORT & LEGAL DECLARATION BOX (LEFT SIDE)
  doc.setFillColor(255, 251, 235);
  doc.roundedRect(14, finalY, 82, isTN ? 32 : 26, 2, 2, 'F');
  doc.setDrawColor(254, 243, 199);
  doc.roundedRect(14, finalY, 82, isTN ? 32 : 26, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(amberColor[0], amberColor[1], amberColor[2]);
  doc.text('PARCEL TRANSPORT & AUDIT DECLARATION:', 17, finalY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  const declText = 'Certified that the particulars given above are true and correct. Amount inclusive of 18% GST under HSN 3604 for auditing & road courier parcel dispatch.';
  doc.text(doc.splitTextToSize(declText, 76), 17, finalY + 10);

  // SIGNATURE SECTION
  const sigY = finalY + (isTN ? 38 : 32);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('For SRI ARUMUGAM PYRO PARK', 190, sigY, { align: 'right' });

  if (signatureImg) {
    doc.addImage(signatureImg, 'PNG', 145, sigY + 2, 44, 14);
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Authorized Signatory: A. Marieswaran', 190, sigY + 18, { align: 'right' });

  // FOOTER
  const footerY = sigY + 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('Official Computer Generated Tax Invoice for Audit & Transport Filing', 105, footerY, { align: 'center' });

  if (triggerDownload) {
    doc.save(`GST_Invoice_${shortId}.pdf`);
  }

  return doc;
}
