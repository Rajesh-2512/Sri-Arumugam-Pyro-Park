import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

export function getProductImage(imageUrl: any): string | null {
  if (!imageUrl) return null;
  if (Array.isArray(imageUrl)) {
    const first = imageUrl[0];
    return typeof first === 'string' && first.trim() !== '' ? first.trim() : null;
  }
  if (typeof imageUrl === 'string' && imageUrl.trim() !== '') {
    return imageUrl.trim();
  }
  return null;
}

export function getAllProductImages(imageUrl: any): string[] {
  if (!imageUrl) return [];
  if (Array.isArray(imageUrl)) {
    return imageUrl.filter((img) => typeof img === 'string' && img.trim() !== '');
  }
  if (typeof imageUrl === 'string' && imageUrl.trim() !== '') {
    return [imageUrl.trim()];
  }
  return [];
}
