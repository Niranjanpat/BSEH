import {URLS} from '../constants/urls';
import client from './axios_client';

export const getUserExpense = async (data) => {
  return await client.get(URLS.user_expense, {
    params: data,
  });
};

export const getUserExpenseDetail = async (id) => {
  return await client.get(URLS.user_expense+'/'+id);
};

export const userExpenseForward = async (data) => {
    return await client.post(URLS.user_expense+'/forward',data);
};

export const userExpenseReject = async (data) => {
  return await client.post(URLS.user_expense+'/reject', data
    );
};
