import {orderCartActions} from '../action_types';

const initState = [];

const orderCartReducer = (state = initState, action) => {
  const {type, payload} = action;

  switch (type) {
    case orderCartActions.STORE_ORDER_CART_ITEMS:
      return payload;

    case orderCartActions.CLEAR_ORDER_CART:
      return [];

    default:
      return state;
  }
};

export default orderCartReducer;
