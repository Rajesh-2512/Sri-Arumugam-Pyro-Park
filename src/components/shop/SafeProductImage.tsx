'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Flame } from 'lucide-react';

interface Props {
  src: string | null | undefined;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
}

export default function SafeProductImage({ src, alt, fill, width, height, sizes, className = '' }: Props) {
  const [error, setError] = useState(false);

  const fallbackSrc = '/images/cracker_placeholder.png';
  const effectiveSrc = !src || error ? fallbackSrc : src;

  return (
    <Image
      src={effectiveSrc}
      alt={alt || 'Cracker Product'}
      fill={fill}
      width={!fill ? width || 80 : undefined}
      height={!fill ? height || 80 : undefined}
      sizes={sizes}
      className={className}
      onError={() => setError(true)}
      unoptimized={effectiveSrc.startsWith('http') || effectiveSrc.startsWith('/images')}
    />
  );
}
