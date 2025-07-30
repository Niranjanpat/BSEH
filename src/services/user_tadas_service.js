import {URLS} from '../constants/urls';
import client from './axios_client';

export const getUserTadas = async (data) => {
  return await client.get(URLS.user_tadas, {
    params: data,
  });
};

export const getUserTadasDetail = async (id) => {
  return await client.get(URLS.user_tadas+'/'+id);
};

export const userTadasForward = async (data) => {
    return await client.post(URLS.user_tadas+'/forward',data);
};

export const userTadasReject = async (data) => {
  return await client.post(URLS.user_tadas+'/reject', data
    );
};
