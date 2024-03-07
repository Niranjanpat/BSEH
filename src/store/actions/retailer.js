import {getRetailer} from '../../services/retailer_services';
import outdatedVersion from '../../utils/outdatedVersion';
import {retailerActions} from '../action_types';
import {storeIsInvalid} from './auth';

export const getRetailerList = () => {
  return async dispatch => {
    getRetailer()
      .then(res => {
        const {data, errors, success} = res.data;
        console.log(res.data);
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
