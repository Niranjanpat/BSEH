import {retailerActions} from '../action_types';

const initialStore = {
  retailerList: [],
  showRetailerFilter: false,
  selectedRetailerFilterMenu: '',
  retailerFilterData: {
    type_id: '',
    class_id: '',
    status: '',
  }
};

const retailerReducer = (state = initialStore, action) => {
  const {type, payload} = action;

  switch (type) {
    case retailerActions.STORE_RETAILER_LIST:
      return {...state, retailerList: payload};

    case retailerActions.STORE_SHOW_RETAILER_FILTER:
      return {...state, showRetailerFilter: payload};

    case retailerActions.STORE_RETAILER_FILTER_MENU:
      return {...state, selectedRetailerFilterMenu: payload};

    case retailerActions.STORE_RETAILER_FILTER_DATA:
      return {...state, retailerFilterData: payload};

    default:
      return state;
  }
};

export default retailerReducer;
