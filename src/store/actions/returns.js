import {returnCartActions} from '../action_types';

import {
  clearCart,
  getCartItems,
  removeProductFromCart,
  storeProductInCart,
} from '../../utils/return_cart';

// load cart items on loging in or app start up
export const initReturnCart = () => {
  return async dispatch => {
    try {
      const cartItems = await getCartItems();
      if (cartItems) {
        dispatch(storeCartItems(cartItems));
      }
    } catch (error) {
      console.log('initReturnCart', error);
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

// store recently visited customer data
export const storeRecentVisit = customer => {
  return {
    type: returnCartActions.STORE_RECENT_VISIT,
    payload: customer,
  };
};
// store return type data
export const storeReturnType = type => {
  return {
    type: returnCartActions.STORE_RETURN_TYPE,
    payload: type,
  };
};

// clear the cart
export const clearCartItems = _ => {
  clearCart();
  return {type: returnCartActions.CLEAR_RETURN_CART, payload: []};
};

export const storeCartItems = payload => {
  return {
    type: returnCartActions.STORE_RETURN_CART_ITEMS,
    payload,
  };
};
