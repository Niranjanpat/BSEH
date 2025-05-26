import Realm from 'realm';
import {schema} from '../../schema';

export const CustomerSchema = {
  name: schema.CUSTOMER,
  primaryKey: '_id', // assuming _id is unique
  properties: {
    _id: 'string',
    billing_address: 'string',
    customer_type: 'string',
    is_monthly_visited:{ type:'bool',default:false},
    is_own_con_num_verified: { type:'bool',default:false},
    is_visited:{ type:'bool',default:false},
    name: 'string',
    owner_contact_number: 'int', // or 'double' if it can be large or have decimals
    route_id: {type:'string',optional:true},
    sap_code: 'string',
  },
};


