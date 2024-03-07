import {orderAction} from '../action_types';

const initialStore = {
  customerVisitStatus: {},
};

const orderReducer = (state = initialStore, action) => {
  const {type, payload} = action;

  switch (type) {
    case orderAction.STORE_CUSTOMER_VISIT_STATUS:
      return {...state, customerVisitStatus: payload};

    default:
      return state;
  }
};

export default orderReducer;
