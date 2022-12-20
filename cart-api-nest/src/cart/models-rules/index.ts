import { Cart } from '../services/entities';

/**
 * @param {Cart} cart
 * @returns {number}
 */
export function calculateCartTotal(cart: Cart): number {
  return cart ? cart.cart_items?.reduce((acc: number, item) => {
    return acc += item.count * item.price;
  }, 0) : 0;
}
