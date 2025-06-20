import {URLS} from '../constants/urls';
import client from './axios_client';

export const getTaDas = async (data) => {
  return await client.get(URLS.ta_das, {params: data});
};

export const getTaDasDetail = async (id) => {
  return await client.get(URLS.ta_das+'/'+id);
};