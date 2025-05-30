import {URLS} from '../constants/urls';
import client from './axios_client';
import clientMultipart from './axios_multipart_client';
//login api
export const login = async (email, password, deviceInfo) => {
  console.log('deviceInfo', deviceInfo);
  console.log('email', email);
  console.log('password', password);
  return await client.post(URLS.login, {
    email,
    password,
    user_device_id: deviceInfo.deviceId,
    user_device_name: deviceInfo.deviceName,
    user_device_os_version: deviceInfo.deviceVersion,
  });
};
//error logs api
export const errorLogs = async (url, method, status_code, body) => {
  return await client.post(URLS.errorLog, {url, method, status_code, body});
};
// user profile api
export const profile = async () => {
  return await client.get(URLS.profile);
};

// update user profile api
export const updateUserProfile = async body => {
  return await client.post(URLS.profile, body);
};

// user attendance Status api
export const attendanceStatus = async () => {
  return await client.get(URLS.punchStatus);
};

export const attendanceList = async date => {
  return await client.get(URLS.attendance + date);
};

export const punchIn = async data => {
  console.log('request -', data);
  return await clientMultipart.post(URLS.attendancePunchIn, data);
};
export const punchOut = async (data) => {
  console.log('punchOut-data', data);
  return await clientMultipart.post(URLS.attendancePunchOut, data);
};

export const getMonthlyAttendanceTravel = async (year, month) => {
  return await client.get(URLS.monthlyAttendanceTravel, {
    params: {
      year,
      month,
    },
  });
};

export const getMonthlyAttendance = async (year, month) => {
  return await client.get(URLS.attendanceMonthly, {
    params: {
      year: year,
      month: month,
    },
  });
};
