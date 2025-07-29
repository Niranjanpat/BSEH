import {URLS} from '../constants/urls';
import client from './axios_client';
import clientMultipart from './axios_multipart_client';

export const getDistributorSchedules = async (
  page,
  start_date,
  end_date,
) => {
  return await client.get(URLS.distributorSchedule, {
    params: {page, start_date, end_date},
  });
};
export const addDistributorSchedule = async data => {
  return await clientMultipart.post(URLS.distributorSchedule, data);
};

export const getDistributorScehduleDetails = async id => {
  return await client.get(`${URLS.distributorSchedule}/${id}`);
};

export const updateDistributorSchedule = async (data, id) => {
  return await client.post(`${URLS.distributorSchedule}/${id}`, data);
};

export const deleteDistributorSchedule = async id => {
  return await client.post(`${URLS.distributorSchedule}/${id}`, {_method: 'DELETE'});
};

export const cancelDistributorSchedule = async (data, id) => {
  return await client.post(`${URLS.distributorSchedule}/${id}/cancel`, data);
};
