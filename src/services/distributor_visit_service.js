import {URLS} from '../constants/urls';
import client from './axios_client';

export const DistributorCheckIn = async location => {
  return await client.post(`${URLS.distributorVisit}/check-in`, location);
};

export const DistributorCheckOut = async location => {
  return await client.post(`${URLS.distributorVisit}/check-out`, location);
};

export const DistributorVisitStatus = async () => {
  return await client.get(`${URLS.distributorVisit}/status`);
};

export const PredefineFeedbackList = async () => {
  return await client.get(`${URLS.distributorVisit}/predefined-feedbacks`);
};

export const saveFeedback = async data => {
  return await client.post(`${URLS.distributorVisit}/save-feedbacks`, data);
};


export const getVisitedDistributor= async (date) => {
  return await client.get(URLS.distributorVisit+'/'+date);
};

export const getTodayDistributorVisits= async (page,assignee) =>{
  return await client.get(URLS.distributors+'/today', {params: {page, assignee}});
}