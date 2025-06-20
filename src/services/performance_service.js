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

export const topScsList = async data => {
  return await client.post(URLS.topScs, data);
};

export const topZmsList = async data => {
  return await client.post(URLS.topZms, data);
};

export const topAsmsList = async data => {
  return await client.post(URLS.topAsms, data);
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
  return await client.get(URLS.userDashboard);
};

export const getTodayReportById = async id => {
  return await client.get(`${URLS.userDashboard}/${id}`);
};

export const getMtdReport = async () => {
  return await client.get(URLS.kamMtd);
};

export const getTodayCumulativereport = async () => {
  return await client.get(URLS.cumulativeReport);
};

export const getMonthlyCumulativereport = async (year, month) => {
  return await client.get(URLS.cumulativeMonthlyReport, {params: { year, month }});
};

export const getCumulativeReport = async date => {
  return await client.get(`${URLS.cumulativeReport}/${date}`);
};

export const getComplianceReport = async (id, date) => {
  return await client.get(`${URLS.kams}/${id}/daily-compliance-report/${date}`);
};


export const getDailyPerformance = async (id, date) => {
  return await client.post(URLS.dailyPerformance, {id, date});
};

export const getCumulativePerformance = async (ids, startDate, endDate) => {
  return await client.post(URLS.cumulativePerformance, {
    ids: ids.length === 0 ? null : JSON.stringify(ids),
    start_date: startDate,
    end_date: endDate,
  });
};

export const getSalesPerformanceProducts = async (ids, startDate, endDate) => {
  return await client.post(URLS.salesPerformance, {
    ids: ids.length === 0 ? null : JSON.stringify(ids),
    start_date: startDate,
    end_date: endDate,
  });
};
