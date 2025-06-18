import {URLS} from '../constants/urls';
import client from './axios_client';

export const getComplaints = async (page) => {
  return await client.get(URLS.complaints,{params:{page}});
};

export const getComplaintsType = async () => {
  return await client.get(URLS.complaints_types);
};

export const addComplaints = async (data) =>{
  return await client.post(URLS.complaints,data);
};
export const updateComplaints = async (data,id) =>{
  return await client.put(URLS.complaints+'/'+id,data);
};

export const getComplaintDetail = async (id) =>{
    return await client.get(URLS.complaints+'/'+id);
}

export const getUserComplaint = async (data) =>{
    return await client.get(URLS.user_complaint,{
        params:{
            page:data.page,
            start_date:data.start,
            end_date:data.end,
            status:data.status
        }
    })
}

export const getUserComplaintDetail = async (id) =>{
    return await client.get(URLS.user_complaint+'/'+id);
}

export const updateUserComplaint = async (data , id) =>{
    return await client.put(URLS.user_complaint+'/'+id,data);
}