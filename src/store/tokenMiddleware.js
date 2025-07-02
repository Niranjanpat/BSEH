import {Alert} from 'react-native';
import {setInvalidToken} from '../store/authSlice';
import {authActions} from './action_types';
import MMKVStorage from 'react-native-mmkv-storage';
import {ROUTES} from '../constants/routes';
import { storeIsInvalid } from './actions/auth';

const mmkv = new MMKVStorage.Loader().initialize();

const tokenMiddleware = store => next => action => {
  return async dispatch => {
    console.log('is token invalid', action.payload);
    const result = next(action);

    if (
      action.type === authActions.STORE_ISINVALID &&
      action.payload === true
    ) {
      const navigation = global.navigationRef;
      if (navigation?.navigate) {
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
      }
    }
  };

  return result;
};

export default tokenMiddleware;
