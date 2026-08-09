'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface UPIQRCodeProps {
  upiId?: string;
  payeeName?: string;
  amount?: number;
  note?: string;
  size?: number;
  className?: string;
}

export default function UPIQRCode({
  upiId = 'krishnanhk55@okaxis',
  payeeName = 'Sri Arumugam Pyro Park',
  amount,
  note = 'Crackers Order Payment',
  size = 220,
  className = '',
}: UPIQRCodeProps) {
  const [qrUrl, setQrUrl] = useState<string>('');

  // Construct standard Indian UPI Payment URL: upi://pay?pa=...&pn=...&am=...&tn=...
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}${
    amount ? `&am=${amount.toFixed(2)}` : ''
  }&tn=${encodeURIComponent(note)}&cu=INR`;

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(upiUrl, {
      width: size,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (isMounted) setQrUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate UPI QR code:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [upiUrl, size]);

  if (!qrUrl) {
    return (
      <div
        className={`bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-xs font-bold animate-pulse ${className}`}
        style={{ width: size, height: size }}
      >
        Generating QR...
      </div>
    );
  }

  return (
    <div className={`inline-block bg-white p-3 rounded-2xl border-2 border-amber-400/90 shadow-lg ${className}`}>
      <img src={qrUrl} alt="Scan to Pay via UPI" className="w-full h-full object-contain rounded-lg" style={{ width: size, height: size }} />
    </div>
  );
}
