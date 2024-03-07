import {URLS} from '../constants/urls';
import client from './axios_client';

// user profile api
export const getUserHierarchyList = async id => {
  return await client.get(URLS.userHierarchy + id);
};

export const getUserTracking = async id => {
  return await client.get(id);
};
