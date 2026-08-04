/**
 * Calculate final price after applying product-level and global discounts sequentially.
 * 
 * Step 1: price_after_product_discount = price * (1 - productDiscount / 100)
 * Step 2: final_price = price_after_product_discount * (1 - globalDiscount / 100)
 */
export const calculateFinalPrice = (
  price: number,
  productDiscount: number = 0,
  globalDiscount: number = 0
): number => {
  const afterProductDiscount = price * (1 - productDiscount / 100);
  const afterGlobalDiscount = afterProductDiscount * (1 - globalDiscount / 100);
  return Math.round(afterGlobalDiscount * 100) / 100;
};

/**
 * Total savings in INR.
 */
export const getSavedAmount = (
  price: number,
  productDiscount: number = 0,
  globalDiscount: number = 0
): number => {
  return Math.round((price - calculateFinalPrice(price, productDiscount, globalDiscount)) * 100) / 100;
};

/**
 * Combined effective discount percentage for display.
 */
export const getEffectiveDiscountPercentage = (
  productDiscount: number = 0,
  globalDiscount: number = 0
): number => {
  const effective = 100 - (1 - productDiscount / 100) * (1 - globalDiscount / 100) * 100;
  return Math.round(effective * 10) / 10;
};
