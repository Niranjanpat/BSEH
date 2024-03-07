import MMKV from 'react-native-mmkv-storage';

const mmkv = new MMKV.Loader().initialize();
const CART_KEY = 'order_cart';

/**
 * Gets an array of persisted the cart.
 *
 * @returns An `array` of the cart.
 */
export const getCartItems = async _ => {
  let cartItems = [];

  const cart = await mmkv.getArrayAsync(CART_KEY);
  if (cart) cartItems = cart;

  return cartItems;
};

/**
 *
 * @param products - Products array.
 *
 * @returns The same array after storing in cart.
 */
export const storeProductsInCart = async products => {
  mmkv.setArrayAsync(CART_KEY, products);
  return products;
};

/**
 *
 * @param product - Product object that has an updated quantity value.
 *
 * @returns An `array` of updated cart.
 */
export const storeProductInCart = async product => {
  let newCart = [];
  const cart = await getCartItems();

  const productInCart = await getProductIfExists(product._id);

  if (productInCart) {
    newCart = cart.map(item => {
      if (item._id === product._id) {
        return product;
      }

      return item;
    });
  } else {
    newCart = [...cart, product];
  }

  mmkv.setArrayAsync(CART_KEY, newCart);
  return newCart;
};

/**
 * Checks if the item exists in the cart.
 *
 * @param key - Argument `key` is a non-optional valid product id.
 *
 * @returns If the product with provided key exists it simply
 * returns the `product` object otherwise return `null`.
 *
 */
export const getProductIfExists = async key => {
  const cart = await getCartItems();

  if (cart) {
    return cart.find(item => item._id === key);
  }

  return null;
};

/**
 * Removes particular product from the cart and returns
 * the updated cart array.
 *
 * @param key Key is a non-optional valid product id.
 *
 * @returns An `array` of updated cart if the `key`
 * is valid else returns null.
 **/
export const removeProductFromCart = async key => {
  const product = getProductIfExists(key);

  if (product) {
    const cart = await getCartItems();

    const newCart = cart.filter(item => item._id !== key);

    mmkv.setArrayAsync(CART_KEY, newCart);
    return newCart;
  }

  return null;
};

/**
 * As the name suggests, it removes every entry in the cart array.
 *
 **/
export const clearCart = _ => {
  mmkv.removeItem(CART_KEY);
};
