import {URLS} from '../constants/urls';
import client from './axios_client';
import clientMultipart from './axios_multipart_client';

export const getExpenseType = async () => {
  return await client.get(URLS.expenseType);
};

export const getExpense = async data => {
  return await client.get(URLS.expense, {params: data});
};

export const addExpense = async data => {
  return await clientMultipart.post(URLS.expense, data);
};
export const updateExpense = async (data, id) => {
  console.log('data in api ', data, id);
  return await clientMultipart.post(URLS.expense + '/' + id, data);
};

export const getExpenseDetail = async id => {
  return await client.get(URLS.expense + '/' + id);
};
