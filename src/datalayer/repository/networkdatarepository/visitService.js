import {URLS} from '../../../constants/urls';
import client from '../../../services/axios_client';

// user profile api
export const getRetailer = async () => {
  return await client.get(URLS.customer);
};

export const addShop = async data => {
  return await client.post(URLS.customer, data);
};
export const editShop = async (data, id) => {
  return await client.put(URLS.customer + id, data);
};

export const getCustomerTarget = async id => {
  const url = `customers/${id}/current-targets`;
  return await client.get(url);
};

export const updateShopLocation = async (id, data) => {
  return await client.post(URLS.customer + id + '/update-location', data);
};
export const getCustomerTypeList = async () => {
  return await client.get(URLS.customerType);
};

export const getCustomerActivityList = async () => {
  return await client.get(URLS.customerActivityCategories);
};

export const getCustomerClassList = async () => {
  return await client.get(URLS.customerClass);
};

export const getBeatList = async isMyVisits => {
  const url = isMyVisits ? URLS.routesToday : URLS.route;
  return await client.get(url);
};

export const getPinCodeList = async value => {
  return await client.get(`pin-codes/search?term=${value}&page=1`);
};

export const getState = async () => {
  return await client.get(`states`);
};

export const getCitiesList = async (value, pinCode) => {
  return await client.get(
    `cities/search?pin_code_id=${pinCode}&term=${value}&page=1`,
  );
};

export const getCitiesDetail = async value => {
  return await client.get(`cities/${value}`);
};
