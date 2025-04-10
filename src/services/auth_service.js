import {URLS} from '../constants/urls';
import client from './axios_client';
//login api
export const login = async (email, password,deviceInfo) => {
  return await client.post(URLS.login, {email, password,       
   user_device_id: deviceInfo.deviceId,
   user_device_name:deviceInfo.deviceName,
   user_device_os_version:deviceInfo.deviceVersion,
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
  return await client.get(URLS.attendanceStatus);
};

export const attendanceList = async date => {
  return await client.get(URLS.attendance + date);
};

export const punchIn = async data => {
  return await client.post(URLS.attendancePuchIn, data);
};
export const punchOut = async data => {
  return await client.post(URLS.attendancePunchOut, data);
};

export const getMonthlyAttendanceTravel = async (year, month) => {
  return await client.get(URLS.monthlyAttendanceTravel, {
    params: {
      year,
      month,
    },
  });
};
