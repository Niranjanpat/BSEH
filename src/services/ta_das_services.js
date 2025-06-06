import {URLS} from '../constants/urls';
import client from './axios_client';

export const getTaDas = async () => {
  return await client.get(URLS.ta_das);
};

export const getTaDasDetail = async (id) => {
  return await client.get(URLS.ta_das+'/'+id);
};