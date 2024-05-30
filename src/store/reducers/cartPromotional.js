import {orderCartActions} from '../action_types';

const initState = [];

const orderCartPromotionalReducer = (state = initState, action) => {
  const {type, payload} = action;

  switch (type) {
    case orderCartActions.STORE_ORDER_CART_PROMOTIONAL_ITEMS:
      return payload;

    case orderCartActions.CLEAR_ORDER_CART_PROMOTIONAL:
      return [];

    default:
      return state;
  }
};

export default orderCartPromotionalReducer;
