import {URLS} from '../constants/urls';
import client from './axios_client';

export const getRouteSchedules = async (page, start_date, end_date) => {
  return await client.get(URLS.routeSchedules, {
    params: {page, start_date, end_date},
  });
};

export const addRouteSchedule = async data => {
  return await client.post(URLS.routeSchedules, data);
};

//i have doubt in this api
export const getRouteScehduleDetails = async id => {
  return await client.get(`${URLS.routeSchedules}/${id}`);
};

export const updateRouteSchedule = async (data, id) => {
  return await client.post(`${URLS.routeSchedules}/${id}`, data);
};

export const deleteRouteSchedule = async id => {
  return await client.post(`${URLS.routeSchedules}/${id}`, {_method: 'DELETE'});
};

export const cancelRouteSchedule = async (data, id) => {
  return await client.post(`${URLS.routeSchedules}/${id}/cancel`, data);
};

export const getUserRouteSchedules = async (
  page,
  start_date,
  end_date,
  status,
) => {
  return await client.get(URLS.userRouteSchedules, {
    params: {page, start_date, end_date, status},
  });
};

export const approveUserRouteSchedules = async data => {
  return await client.post(`${URLS.userRouteSchedules}/approve`, data);
};

export const rejectUserRouteSchedules = async data => {
  return await client.post(`${URLS.userRouteSchedules}/reject`, data);
};

export const getRoutes = async (params) => {
  return await client.get(URLS.route, {params});
};
