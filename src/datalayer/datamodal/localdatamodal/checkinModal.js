import Realm from 'realm';
import { schema } from '../../schema';

export const CheckInSchema = {
  name: schema.CHECKIN,
  primaryKey: 'customerID', // optional, if you want to use customerID as the primary key
  properties: {
    createdAt: new Date(),
    customerID: 'string',
    latitude: 'double',
    longitude: 'double',
  },
};
