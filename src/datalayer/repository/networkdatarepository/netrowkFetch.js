import {getProduct} from './visitService';
import {getCustomer} from './visitService';

const FetchMap = {
  Product: getProduct(),
  Customer: getCustomer(),
};

export const getFetchFunctionByKey = (key) => {
  return FetchMap[key] || null;
};