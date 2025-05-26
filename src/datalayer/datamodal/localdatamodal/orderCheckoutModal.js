import Realm from 'realm';
import {schema} from '../../schema';

export const OrderSummarySchema = {
  name: schema.ORDERCHECKOUT,
  properties: {
    schemes: 'Scheme[]',              // custom object array
    total_order_amount: 'double',     // from 19.17
    total_order_quantity: 'int',      // from 3
  },
};

