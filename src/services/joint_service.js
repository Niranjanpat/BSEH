import {URLS} from '../constants/urls';
import client from './axios_client';
//login api
export const getDSM = async () => {
  return await client.get(URLS.dsms);
};
export const getSO = async () => {
  return await client.get(URLS.salesOfficers);
};

export const postStartJointWork = async data => {
  return await client.post(URLS.startJointWork, data);
};
export const postEndJointWork = async data => {
  return await client.post(URLS.endJointWork, data);
};
export const getJointWorkStatus = async () => {
  return await client.get(URLS.jointWorkStatus);
};

export const getJointWorkingList = async date => {
  return await client.get(`${URLS.jointWorkings}`, {
    date,
  });
};

export const getGuestRoutes = guestId => {
  console.log(guestId);
  return client.get('/users/' + guestId + '/today-routes');
};

export const customerListByBeatId = async id => {
  return await client.get(`${URLS.route}/${id}/customers`);
};

export const getJointGeolocation = async id => {
  return await client.get(`${URLS.userJointWork}/${id}/geolocations`);
};

export const getUserJointWorking = async (date, page) => {
  return await client.get(`${URLS.userJointWork}`, {
    date,
    page,
  });
};
export const customerVisitStatus = async () => {
  return await client.get(URLS.jointVisitCheckedInStatus);
};

export const customerCheckIn = async data => {
  return await client.post(URLS.jointVisitCheckIn, data);
};

export const customerCheckOut = async data => {
  return await client.post(URLS.jointVisitCheckOut, data);
};

export const updateShopLocation = async (id, data) => {
  return await client.post(URLS.customer + id + '/update-location', data);
};

export const postFeedback = async feedback => {
  return await client.post(URLS.jointVisitFeedback, feedback);
};

export const getAllUsers = async (page, role) => {
  return await client.get(URLS.allUsers, {params: {page, role}});
};
