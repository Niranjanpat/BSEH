import {getRetailer} from '../../services/retailer_services';
import outdatedVersion from '../../utils/outdatedVersion';
import {retailerActions} from '../action_types';
import {storeIsInvalid} from './auth';

export const getRetailerList = (routeId, filterData, assignee) => {
  return async dispatch => {
    getRetailer(routeId, filterData, assignee)
      .then(res => {
        const {data, errors, success} = res.data;
        
        if (success) {
          dispatch(storeRetailerList(data.customers));
        } else {
        }
      })
      .catch(e => {
        console.log('getRetailerList', e);
      });
  };
};

export const storeRetailerList = payload => {
  return {type: retailerActions.STORE_RETAILER_LIST, payload};
};

export const storeShowRetailerFilter = payload => {
  return {type: retailerActions.STORE_SHOW_RETAILER_FILTER, payload};
};

export const storeRetailerFilterSelectedMenu = payload => {
  return {type: retailerActions.STORE_RETAILER_FILTER_MENU, payload};
};

export const storeRetailerFilterData = payload => {
  return {type: retailerActions.STORE_RETAILER_FILTER_DATA, payload};
};
