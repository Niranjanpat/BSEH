import {URLS} from '../constants/urls';
import client from './axios_client';

export const CustomerCheckIn = async location => {
  return await client.post(URLS.customerCheckIn, location);
};

export const CustomerCheckOut = async location => {
  return await client.post(URLS.customerCheckOut, location);
};

export const CustomerVisitStatus = async () => {
  return await client.get(URLS.customerVisitStatus);
};

export const VerticalList = async () => {
  return await client.get(URLS.verticals);
};

export const BrandList = async id => {
  console.log(URLS.verticals + id + URLS.brands);
  return await client.get(URLS.verticals + id + URLS.brands);
};

export const ProductList = async id => {
  return await client.get(URLS.brands + id + URLS.products);
};
export const SchemeList = async id => {
  return await client.get(URLS.brands + id + URLS.schemes);
};
export const PredefineFeedbackList = async () => {
  return await client.get(URLS.predefineFeedback);
};

export const saveFeedback = async data => {
  return await client.post(URLS.saveFeedback, data);
};

export const saveOrder = async (productList, customer, hideCheckoutAfterOrder) => {
  const customer_id = customer._id;
  const products = JSON.stringify(productList);

  if (hideCheckoutAfterOrder) {
    return await client.post(URLS.orders, {
      customer_id,
      products,
      is_on_call: 1,
    });
  } else {
    return await client.post(URLS.orders, {
      customer_id,
      products,
    });
  }
};

export const saveSalesReturn = async (productList, customer, reason) => {
  const customer_id = customer._id;
  const products = JSON.stringify(productList);

  return await client.post(URLS.salesReturn, {
    customer_id,
    products,
    reason,
  });
};

export const sendMail = async response => {
  const url = URLS.orders + `${response._id}/send-email-excel`;

  return await client.get(url);
};

export const getAllProducts = async (page, term) => {
  return await client.get(URLS.allProducts, {params: {page, term}});
};

export const addPromoterSales = async data => {
  return await client.post(URLS.promoterSales, data);
};

export const addPromoterClosingStock = async data => {
  return await client.post(URLS.promoterClosingStock, data);
};

export const getSchemes = async (data, id) => {
  return await client.post(`${URLS.products}/schemes`, {
    products: JSON.stringify(data),
    customer_id: id,
  });
};
