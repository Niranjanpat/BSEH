import {orderAction} from '../action_types';

const initialStore = {
  customerVisitStatus: {},
  hideCheckoutAfterOrder: false,
  customerForOrderOnCall: {},
  checkVisitLoading: false,
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

    case orderAction.STORE_CHECK_VISIT_LOADING:
      return {...state, checkVisitLoading: payload};

    default:
      return state;
  }
};

export default orderReducer;
