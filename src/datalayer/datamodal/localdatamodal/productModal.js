import Realm from 'realm';
import {schema} from '../../schema';
export const ProductSchema = {
  name: schema.PRODUCT,
  primaryKey: '_id', // Assuming _id is unique
  properties: {
    _id: 'string',
    cld: 'double',
    cross_sell_line: { type: 'bool', optional: true },            
    discounts: {type:'string[]',optinal:true}, // Assuming it's an array of strings. Update if it's objects.
    distributorsellingprice:{type: 'double',optional:true},
    is_featured: { type: 'bool', optional: true },                
    is_multiplication_minimum_order_quantity:{ type:'bool', optional: true }, 
    is_quarterly_sold:{ type:'bool',optional:true},
    minimum_order_quantity: { type: 'double', optional: true },   
    mrp: 'double',
    must_sell_line: { type: 'bool', optional: true },            
    name: 'string',
    ordered_quantity: 'double',
    photo_url: { type: 'string', optional: true },               
    sap_code: 'int',
    stock: { type: 'double', optional: true },                 
    suggested_line: { type: 'bool', optional: true },            
    unit: { type: 'string', optional: true },                    
  },
};
