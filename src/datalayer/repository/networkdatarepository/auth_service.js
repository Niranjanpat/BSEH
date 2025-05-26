import {URLS} from '../../../utils/urls';
import client from './axios_client';
//login api
export const login = async (email, password,deviceInfo) => {
  return await client.post(URLS.login, {email, password,       
   user_device_id: deviceInfo.deviceId,
   user_device_name:deviceInfo.deviceName,
   user_device_os_version:deviceInfo.deviceVersion,
  });
};