import {URLS} from '../constants/urls';
import client from './axios_client';
//login api
export const todaysOrder = async data => {
  return await client.post(URLS.todaysOrder, data);
};

export const achievements = async () => {
  return await client.get(URLS.achievements);
};

export const currentOverAllTargetsAmount = async () => {
  return await client.get(URLS.currentOverAllTargetsAmount);
};

export const topDSMList = async data => {
  return await client.post(URLS.topDsms, data);
};

export const topCustomerList = async data => {
  return await client.post(URLS.topCustomersPerformance, data);
};

export const weeklyOrderLog = async data => {
  return await client.post(URLS.dailyOrderPerformance, data);
};

export const topDistributorsList = async data => {
  return await client.post(URLS.topDistributors, data);
};

export const topSalesOfficerList = async data => {
  return await client.post(URLS.topSalesOfficer, data);
};

export const dailyOrderList = async data => {
  return await client.post(URLS.dailyOrderPerformance, data);
};

export const dailyCustomerOrderList = async data => {
  return await client.post(URLS.dailyCustomerOrder, data);
};

export const customerOrderList = async data => {
  return await client.post(URLS.customerOrderPerformance, data);
};
export const todayCustomerOrder = async data => {
  return await client.post(URLS.todayCustomerOrder, data);
};

export const userBeatList = async id => {
  return await client.get(`users/${id}/routes`);
};

export const customerListByBeatId = async id => {
  return await client.get(`${URLS.route}/${id}/customers`);
};

export const getTodayReport = async () => {
  return await client.get(URLS.kamDashboard);
};

export const getTodayReportById = async id => {
  return await client.get(`${URLS.kamDashboard}/${id}`);
};

export const getMtdReport = async () => {
  return await client.get(URLS.kamMtd);
};

export const getTodayCumulativereport = async () => {
  return await client.get(URLS.cumulativeReport);
};

export const getCumulativeReport = async date => {
  return await client.get(`${URLS.cumulativeReport}/${date}`);
};

export const getComplianceReport = async (id, date) => {
  return await client.get(`${URLS.kams}/${id}/daily-compliance-report/${date}`);
};
