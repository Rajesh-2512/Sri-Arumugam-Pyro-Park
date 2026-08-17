import { z } from 'zod';

/**
 * Validates Indian Mobile Number: 10 digits starting with 6, 7, 8, or 9
 */
export const PHONE_REGEX = /^[6-9]\d{9}$/;

export function isValidIndianPhone(phone: string): boolean {
  const clean = (phone || '').replace(/\D/g, '');
  return PHONE_REGEX.test(clean);
}

/**
 * Validates Indian PIN Code: 6 digits starting with 1-9
 */
export const PINCODE_REGEX = /^[1-9]\d{5}$/;

export function isValidIndianPincode(pincode: string): boolean {
  const clean = (pincode || '').replace(/\D/g, '');
  return PINCODE_REGEX.test(clean);
}

/**
 * Validates Aadhar (12 numeric digits) or PAN (10 alphanumeric: 5 letters + 4 numbers + 1 letter)
 */
export const AADHAR_REGEX = /^\d{12}$/;
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export type AadharPanType = 'aadhar' | 'pan' | 'invalid';

export interface AadharPanValidationResult {
  isValid: boolean;
  type: AadharPanType;
  cleanValue: string;
  message?: string;
}

export function validateAadharOrPan(value: string): AadharPanValidationResult {
  if (!value || !value.trim()) {
    return { isValid: false, type: 'invalid', cleanValue: '', message: 'Aadhar or PAN number is required' };
  }

  // Remove spaces, hyphens, and convert to uppercase
  const clean = value.replace(/[\s-]/g, '').toUpperCase();

  const isAadhar = AADHAR_REGEX.test(clean);
  if (isAadhar) {
    return {
      isValid: true,
      type: 'aadhar',
      cleanValue: clean,
    };
  }

  const isPan = PAN_REGEX.test(clean);
  if (isPan) {
    return {
      isValid: true,
      type: 'pan',
      cleanValue: clean,
    };
  }

  // Helpful hint if user is typing
  let message = 'Enter valid 12-digit Aadhar (e.g. 564986799886) or 10-char PAN (e.g. ABCDE1234F)';
  if (/^\d+$/.test(clean)) {
    if (clean.length < 12) {
      message = `Aadhar number requires 12 digits (${clean.length}/12 entered)`;
    } else if (clean.length > 12) {
      message = `Aadhar number cannot exceed 12 digits (${clean.length} entered)`;
    }
  } else if (/^[A-Z0-9]+$/.test(clean)) {
    if (clean.length !== 10) {
      message = `PAN Card requires 10 characters (${clean.length}/10 entered)`;
    } else {
      message = 'PAN Card format must be 5 letters, 4 numbers, 1 letter (e.g. ABCDE1234F)';
    }
  }

  return {
    isValid: false,
    type: 'invalid',
    cleanValue: clean,
    message,
  };
}

/**
 * Shared Zod Schema rules for Phone, Aadhar/PAN, and Pincode
 */
export const phoneZodSchema = z
  .string()
  .min(1, 'Mobile number is required')
  .transform((val) => (val || '').replace(/\D/g, ''))
  .refine((val) => PHONE_REGEX.test(val), {
    message: 'Enter valid 10-digit Indian mobile number starting with 6, 7, 8, or 9',
  });

export const pincodeZodSchema = z
  .string()
  .min(1, 'PIN code is required')
  .transform((val) => (val || '').replace(/\D/g, ''))
  .refine((val) => PINCODE_REGEX.test(val), {
    message: 'Enter valid 6-digit Indian PIN code (e.g. 600001)',
  });

export const aadharPanZodSchema = z
  .string()
  .min(1, 'Aadhar or PAN number is required')
  .transform((val) => (val || '').replace(/[\s-]/g, '').toUpperCase())
  .refine(
    (val) => {
      const res = validateAadharOrPan(val);
      return res.isValid;
    },
    {
      message: 'Enter valid 12-digit Aadhar (e.g. 564986799886) or 10-char PAN (e.g. ABCDE1234F)',
    }
  );
