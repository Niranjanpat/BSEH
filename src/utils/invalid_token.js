import {Alert} from 'react-native';
import MMKVStorage from 'react-native-mmkv-storage';

import {ROUTES} from '../constants/routes';
import {storeIsInvalid} from '../store/actions/auth';

const mmkv = new MMKVStorage.Loader().initialize();

const tokenInvalid = navigation => {
  return async dispatch => {
    Alert.alert(
      'Multiple Login',
      'Log in from second device detected. Please log in again.',
      [
        {
          text: 'OK',
          onPress: () => {
            mmkv.clearStore();
            navigation.replace(ROUTES.auth_stack);
            dispatch(storeIsInvalid(false));
          },
        },
      ],
    );
  };
};

export default tokenInvalid;
