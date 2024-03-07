import {retailerActions} from '../action_types';

const initialStore = {
  retailerList: [],
};

const retailerReducer = (state = initialStore, action) => {
  const {type, payload} = action;

  switch (type) {
    case retailerActions.STORE_RETAILER_LIST:
      return {...state, retailerList: payload};

    default:
      return state;
  }
};

export default retailerReducer;
