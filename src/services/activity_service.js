import {URLS} from '../constants/urls';
import client from './axios_client';

export const todayOrderList = async date => {
  return await client.get(URLS.orders + `?date=${date}`);
};

export const saleReturn = async date => {
  return await client.get(URLS.salesReturns + `?date=${date}`);
};

export const orderDetail = async id => {
  return await client.get(URLS.orders + id);
};

export const updateOrder = async (id, data) => {
  const products = JSON.stringify(data);
  return await client.put(URLS.orders + id, {products});
};

export const salesReturnDetail = async id => {
  return await client.get(URLS.salesReturns + id);
};

export const invoiceOrderList = async date => {
  return await client.get(URLS.invoices + `?date=${date}`);
};

export const invoiceOrderDetail = async id => {
  return await client.get(URLS.invoices + id);
};

export const deleteOrders = async (id, data) => {
  return await client.post(URLS.orders + id, data);
};

export const deleteSalesReturn = async (id, data) => {
  return await client.post(URLS.salesReturns + id, data);
};

export const scheduleSummary = async date => {
  return await client.get(URLS.scheduleSummary + date);
};

export const activityGeolocation = async date => {
  return await client.get(URLS.geolocations + `?date=${date}`);
};

export const sendOTP = async id => {
  return await client.post(`${URLS.customer}${id}/send-verification-otp`);
};

export const verifyOTP = async (id, otp) => {
  return await client.post(
    `${URLS.customer}${id}/verify-owner-contact-number`,
    {otp: otp},
  );
};

export const updateCustomerNumber = async (id, number) => {
  return await client.post(
    `${URLS.customer}${id}/update-owner-contact-number`,
    {owner_contact_number: number},
  );
};
