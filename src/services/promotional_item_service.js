import {URLS} from '../constants/urls';
import client from './axios_client';

export const customerPromotionalItem = async params => {
  return await client.get(URLS.customerPromotionalItems, {params});
};

export const userPromotionalItem = async params => {
  return await client.get(URLS.userPromotionalItems, {params});
};

export const assignPromotionalItem = async data => {
    return await client.post(URLS.customerPromotionalItems, data);
};
