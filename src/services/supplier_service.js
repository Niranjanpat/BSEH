import {URLS} from '../constants/urls';
import client from './axios_client';

export const getDistributors = async (page,assignee) => {
  return await client.get(URLS.distributors,{params:{page,assignee}});
};

export const getDistributorDetail = async id => {
  return await client.get(`${URLS.distributors}/${id}`);
};

export const updateDistributor = async (id, values) => {
  return await client.post(`${URLS.distributors}/${id}`, {
    ...values,
    _method: 'put',
  });
};

export const getSDIs = async (userId,name, page, assignee) => {
//  console.log(userId);
  return await client.get(URLS.sdis, {
    params: {
      page,
      assignee,
      user_id: userId,
      name:name,
    },
  });
};

export const getSDIDetail = async id => {
  return await client.get(`${URLS.sdis}/${id}`);
};

export const updateSDI = async (id, values) => {
  return await client.post(`${URLS.sdis}/${id}`, {
    ...values,
    _method: 'put',
  });
};

export const getSuperStockists = async (userId,name, page, assignee) => {
  console.log(userId);
  return await client.get(URLS.superStockists, {
    params: {
      page,
      assignee,
      user_id: userId,
      name:name,
    },
  });
};

export const getSuperStockistDetail = async id => {
  return await client.get(`${URLS.superStockists}/${id}`);
};

export const updateSuperStockist = async (id, values) => {
  return await client.post(`${URLS.superStockists}/${id}`, {
    ...values,
    _method: 'put',
  });
};

export const getBeatList = async (userId, assignee, frequency,name) => {
  console.log('UserId',userId);
  return await client.get(URLS.route, {
    params: {
      assignee,
      frequency,
      user_id: userId,
      name:name
    },
  });
};
