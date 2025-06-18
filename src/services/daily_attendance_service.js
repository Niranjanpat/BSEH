import {URLS} from '../constants/urls';
import client from './axios_client';

export const getUsersDailyAttendance = async (date, page) => {
  return await client.get(URLS.userDailyAttendaces, {
    params: {
      date,
      page,
    },
  });
};

export const getAllUsersDailyAttendance = async (date, page) => {
  return await client.get(`${URLS.userDailyAttendaces}/all-users`, {
    params: {
      date,
      page,
    },
  });
};

export const markUserAbsent = async data => {
  return await client.post(`${URLS.userDailyAttendaces}/mark-absent`, data);
};
