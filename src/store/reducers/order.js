import {orderAction} from '../action_types';

const initialStore = {
  customerVisitStatus: {},
  hideCheckoutAfterOrder: false,
  customerForOrderOnCall: {},
};

const orderReducer = (state = initialStore, action) => {
  const {type, payload} = action;

  switch (type) {
    case orderAction.STORE_CUSTOMER_VISIT_STATUS:
      return {...state, customerVisitStatus: payload};

    case orderAction.STOTE_HIDE_CHECKOUT_AFTER_ORDER:
      return {...state, hideCheckoutAfterOrder: payload};

    case orderAction.STORE_CUSTOMER_FOR_ORDER_ON_CALL:
      return {...state, customerForOrderOnCall: payload};

    default:
      return state;
  }
};

export default orderReducer;
