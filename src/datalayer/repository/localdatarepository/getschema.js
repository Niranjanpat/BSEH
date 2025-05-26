import { ProductSchema } from '../../datamodal/localdatamodal/productModal';
import {CheckInSchema} from '../../datamodal/localdatamodal/checkinModal';
import {CheckOutSchema} from '../../datamodal/localdatamodal/checkoutModal';
import { CustomerSchema } from '../../datamodal/localdatamodal/customerModal';
import {OrderSchema} from '../../datamodal/localdatamodal/orderModal';
import { OrderSummarySchema } from '../../datamodal/localdatamodal/orderCheckOutModal';
import {UserSchema} from '../../datamodal/localdatamodal/user';

const schemaMap = {
  Product: ProductSchema,
  Customer: CustomerSchema,
  User: UserSchema,
  OrderSummary: OrderSummarySchema,
  Order: OrderSchema,
  CheckIn:CheckInSchema,
  CheckOut:CheckOutSchema,
};

export const getSchemaByKey = (key) => {
  return schemaMap[key] || null;
};