export interface SavedCustomerDetails {
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  notes?: string;
}

export interface CustomerOrderHistoryItem {
  id: string;
  date: string;
  total_amount: number;
  items_count: number;
  items: { name: string; quantity: number; price: number }[];
  customer_name: string;
  city: string;
}

const COOKIE_NAME_DETAILS = 'customer_shipping_details';
const COOKIE_NAME_HISTORY = 'customer_order_history';

export function setCookie(name: string, value: string, days: number = 365) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  try {
    localStorage.setItem(name, value);
  } catch (e) {
    // Fallback if localStorage unavailable
  }
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
  if (matches) {
    return decodeURIComponent(matches[1]);
  }
  try {
    return localStorage.getItem(name);
  } catch (e) {
    return null;
  }
}

export function saveCustomerDetailsToCookie(details: SavedCustomerDetails) {
  setCookie(COOKIE_NAME_DETAILS, JSON.stringify(details));
}

export function getCustomerDetailsFromCookie(): SavedCustomerDetails | null {
  const raw = getCookie(COOKIE_NAME_DETAILS);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function addOrderToHistoryCookie(order: CustomerOrderHistoryItem) {
  const history = getOrderHistoryFromCookie();
  const updated = [order, ...history.filter((o) => o.id !== order.id)].slice(0, 20);
  setCookie(COOKIE_NAME_HISTORY, JSON.stringify(updated));
}

export function getOrderHistoryFromCookie(): CustomerOrderHistoryItem[] {
  const raw = getCookie(COOKIE_NAME_HISTORY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}
