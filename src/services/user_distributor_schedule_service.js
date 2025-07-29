import {URLS} from '../constants/urls';
import client from './axios_client';

export const getUserDistributorSchedules = async (
  page,
  start_date,
  end_date,
  status,
) => {
  return await client.get(URLS.userDistributorSchedule, {
    params: {page, start_date, end_date, status},
  });
};

export const approveUserDistributorSchedules = async data => {
  return await client.post(`${URLS.userDistributorSchedule}/approve`, data);
};

export const rejectUserDistributorSchedules = async data => {
  return await client.post(`${URLS.userDistributorSchedule}/reject`, data);
};