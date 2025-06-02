import {URLS} from '../constants/urls';
import client from './axios_client';
import clientMultipart from './axios_multipart_client';

export const getComplaints = async (page) => {
  return await client.get(URLS.complaints,{params:{page}});
};

export const getComplaintsType = async () => {
  return await client.get(URLS.complaints_types);
};

export const addComplaints = async (data) =>{
  return await clientMultipart.post(URLS.complaints,data);
};
export const updateComplaints = async (data,id) =>{
  return await clientMultipart.put(URLS.complaints+'/'+id,data);
};
