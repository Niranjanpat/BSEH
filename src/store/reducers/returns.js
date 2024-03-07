import {returnCartActions} from '../action_types';

const initState = {
  returnItems: [],
  recentCustomer: {},
  returnType: null,
};

const returnCartReducer = (state = initState, action) => {
  const {type, payload} = action;

  switch (type) {
    case returnCartActions.STORE_RECENT_VISIT:
      return {
        ...state,
        recentCustomer: payload,
      };

    case returnCartActions.STORE_RETURN_TYPE:
      return {
        ...state,
        returnType: payload,
      };

    case returnCartActions.STORE_RETURN_CART_ITEMS:
      return {
        ...state,
        returnItems: payload,
      };

    case returnCartActions.CLEAR_RETURN_CART:
      return {
        ...state,
        returnItems: [],
      };

    default:
      return state;
  }
};

export default returnCartReducer;
