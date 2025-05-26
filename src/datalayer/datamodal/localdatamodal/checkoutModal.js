import Realm from 'realm';
import {schema} from '../../schema';

export const CheckOutSchema = {
  name: schema.CHECKOUT,
  primaryKey: 'customerID', // optional, if you want to use customerID as the primary key
  properties: {
    customerID: 'int',
    createdAt:new Date(),          // number -> 'int'
    latitude: 'double',         // number -> 'double'
    longitude: 'double',        // number -> 'double'
    feedback: 'string[]',        // empty array -> assume it's a list of strings
  },
};

