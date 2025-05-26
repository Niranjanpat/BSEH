import Realm from 'realm';
import {schema} from '../../schema';
export const OrderSchema={
    name: schema.ORDER,
    primaryKey: 'orderID',
    properties: {
        orderID: 'string',
        customerID: 'string',
        orderDate: 'date',
        orderStatus: 'string',
        orderAmount: 'double',
        orderItems: 'OrderItem[]', // custom object array
    },
}
