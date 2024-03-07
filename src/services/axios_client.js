import axios from 'axios';
import {Platform} from 'react-native';
import MMKVStorage from 'react-native-mmkv-storage';
import VersionNumber from 'react-native-version-number';

import outdatedVersion from '../utils/outdatedVersion';
import store from '../store';
import {URLS} from '../constants/urls';
import {storeIsInvalid} from '../store/actions/auth';

//initialize mmkv storage
const mmkv = new MMKVStorage.Loader().initialize();

const client = axios.create({
  baseURL: URLS.base,
});

client.interceptors.request.use(config => {
  const token = mmkv.getString('token');
  config.headers.Accept = 'application/json';
  config.headers['x-auth'] = token;
  config.headers['version'] = VersionNumber.buildVersion;
  config.headers['platform'] = Platform.OS;

  return config;
});

client.interceptors.response.use(
  response => {
    const {errors} = response.data;

    if (errors.token) {
      mmkv.clearStore();
      store.dispatch(storeIsInvalid(true));
    }
    if (errors.version) {
      outdatedVersion();
    }
    return response;
  },
  error => {
    return error;
  },
);

export default client;
