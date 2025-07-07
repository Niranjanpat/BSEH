import axios from 'axios';
import {Alert, Platform} from 'react-native';
import {URLS} from '../constants/urls';
import MMKVStorage from 'react-native-mmkv-storage';
import VersionNumber from 'react-native-version-number';

import outdatedVersion from '../utils/outdatedVersion';
import store from '../store';
import {storeIsInvalid} from '../store/actions/auth';
import { handleNetworkError } from './axios_client';

const mmkv = new MMKVStorage.Loader().initialize();

const clientMultipart = axios.create({
  baseURL: URLS.base,
});

clientMultipart.interceptors.request.use(config => {
  const token = mmkv.getString('token');
  console.log('token', token);
  config.headers['x-auth'] = token;

  config.headers['version'] = VersionNumber.buildVersion;
  config.headers['platform'] = Platform.OS;
  config.headers['Content-Type'] = 'multipart/form-data';
  config.headers['Accept'] = 'application/json';
  return config;
});

clientMultipart.interceptors.response.use(
  response => {
    const {errors} = response.data;
    if (errors.token) {
      mmkv.clearStore();
      store.dispatch(storeIsInvalid(true));
      return Promise.resolve({
        data: { data: null, errors: null, success: false },
      });
    }
    if (errors.version) {
      outdatedVersion();
    }
    return response;
  },
  error => handleNetworkError(error),
);

export default clientMultipart;
