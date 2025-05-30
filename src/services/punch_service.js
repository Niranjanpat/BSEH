import {URLS} from '../constants/urls';
import client from './axios_client';

export const getPresentReason = async () => {
  return await client.get(URLS.present);
};

export const getAbsentReason = async () => {
  return await client.get(URLS.absent);
};

export const getWorkType = async () => {
  return await client.get(URLS.workType);
};

export const getVehicleType = async () => {
  return await client.get(URLS.vehicleType);
};

export const getDailyAllowance = async () => {
  return await client.get(URLS.dailyAllowance);
};

export const saveMarkPresent = async data => {
  return await client.post(URLS.markPresent, data);
};

export const saveMarkAbsent = async data => {
  return await client.post(URLS.markAbsent, data);
};

export const getMonthlyAttendanceTravel = async () => {
  return await client.get(URLS.attendanceMonthly);
};

export const getAttendanceStatus = async () => {
  return await client.get(URLS.status);
};

export const getAttendance = async date => {
  return await client.get(URLS.attendance + '/' + date);
};
