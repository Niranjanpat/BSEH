import {URLS} from '../constants/urls';
import client from './axios_client';
import clientMultipart from './axios_multipart_client';

export const getSample = async (date) => {
  return await client.get(URLS.sample, {
    params: {date},
  });
};

export const getSampleDetail = async (id) => {
  return await client.get(URLS.sample+'/'+id);
};


export const saveSample = async (data) => {
  console.log("data",data);
  return await clientMultipart.post(URLS.sample,data);
};