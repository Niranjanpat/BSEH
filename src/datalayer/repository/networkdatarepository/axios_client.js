import axios from 'axios';
import { Platform } from 'react-native';
import VersionNumber from 'react-native-version-number';

import outdatedVersion from '../../../utils/outdatedVersion';
import tokenStore from '../../../store/tokenStore'; 
import { URLS } from '../../../utils/urls';

const client = axios.create({
  baseURL: URLS.base,
});

client.interceptors.request.use(config => {
  const token = tokenStore.getToken(); 

  console.log("Token in request:", token ?? '');

  config.headers.Accept = 'application/json';
  config.headers['x-auth'] = token;
  config.headers['version'] = VersionNumber.buildVersion;
  config.headers['platform'] = Platform.OS;

  return config;
}, error => {
  return Promise.reject(error);
});

client.interceptors.response.use(
  response => {
    const { errors } = response.data;

    if (errors?.token) {
      tokenStore.clearToken();
      tokenStore.setStoreInvalid(true); 
    }

    if (errors?.version) {
      outdatedVersion(); 
    }

    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

export default client;
