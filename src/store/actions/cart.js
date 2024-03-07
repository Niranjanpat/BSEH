import {orderCartActions} from '../action_types';

import {
  clearCart,
  getCartItems,
  removeProductFromCart,
  storeProductInCart,
  storeProductsInCart,
} from '../../utils/order_cart';

// load cart items on loging in or app start up
export const initOrderCart = () => {
  return async dispatch => {
    try {
      const cartItems = await getCartItems();
      if (cartItems) {
        dispatch(storeCartItems(cartItems));
      }
    } catch (error) {
      console.log('initOrderCart', error);
    }
  };
};

// load cart items on reaching update order screen
export const initOrderWithProducts = products => {
  return async dispatch => {
    try {
      const cartItems = await storeProductsInCart(products);
      if (cartItems) {
        dispatch(storeCartItems(cartItems));
      }
    } catch (error) {
      console.log('initOrderWithProducts', error);
    }
  };
};

//update item count to cart
export const updateItemToCart = product => {
  return async dispatch => {
    try {
      const cartItems = await storeProductInCart(product);
      if (cartItems) {
        dispatch(storeCartItems(cartItems));
      }
    } catch (error) {
      console.log('updateItemToCart', error);
    }
  };
};

// removes the item from cart and updates the cart array
export const removeItemFromCart = productId => {
  return async dispatch => {
    try {
      const cart = await removeProductFromCart(productId);
      if (cart) {
        dispatch(storeCartItems(cart));
      }
    } catch (error) {
      console.log('removeItemFromCart', error);
    }
  };
};

// clear the cart
export const clearCartItems = _ => {
  clearCart();
  return {type: orderCartActions.CLEAR_ORDER_CART, payload: []};
};

export const storeCartItems = payload => {
  return {
    type: orderCartActions.STORE_ORDER_CART_ITEMS,
    payload,
  };
};
