import {saveCheckIn} from '../networkdatarepository/visitService';
import {saveCheckOut} from '../networkdatarepository/visitService';
import {saveOrder} from '../networkdatarepository/visitService';
import {saveOrderCheckOut} from '../networkdatarepository/visitService';
import {saveCustomer} from '../networkdatarepository/visitService';


const FetchMap = {
  Customer: saveCustomer,
  CheckIn: saveCheckIn,
  CheckOut: saveCheckOut,
  Order: saveOrder,
  OrderSummary: saveOrderCheckOut,
};

const getFetchFunctionByKey = (key) => {
  return FetchMap[key] || null;
};

export const executeSaveFunction = async (key,data) => {
  const saveFunction = getFetchFunctionByKey(key);
  if (!saveFunction) {
    console.warn(`No fetch function found for key: ${key}`);
    return;
  }
  try {
    await saveFunction(data);
  } catch (err) {
    console.error(`Error executing fetch function for key: ${key}`, err);
  }
};