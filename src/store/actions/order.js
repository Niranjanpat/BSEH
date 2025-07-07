import {
  CustomerCheckIn,
  CustomerCheckOut,
  CustomerVisitStatus,
} from '../../services/order_service';
import {Alert} from 'react-native';
import {storeIsInvalid} from './auth';
import {orderAction} from '../action_types';

import {ROUTES} from '../../constants/routes';
import outdatedVersion from '../../utils/outdatedVersion';
import {updateShopLocation} from '../../services/retailer_services';
import MMKVStorage from 'react-native-mmkv-storage';
import dayjs from 'dayjs';

const mmkv = new MMKVStorage.Loader().initialize();

export const getCustomerVisitStatus = () => {
  return async dispatch => {
    CustomerVisitStatus()
      .then(res => {
        const {data, errors, success} = res.data;
        console.log(data);
        if (success) {
          dispatch(storeCustomerVisitStatus(data));
        } else {
        }
      })
      .catch(e => {
        alert(e);
      })
      .finally(() => {
        dispatch(storeCustomerVisitStatusLoading(false));
      });
  };
};
export const setHideCheckoutAfterOrderPlaces = (isHide) => {
  return async dispatch => {
    dispatch(storeHideCheckoutAfterOrderPlaces(isHide));
  };
};
export const setCustomerForOrderOnCall = (_id, name) => {
  return async dispatch => {
    dispatch(storeCustomerForOrderOnCall({_id, name}));
  };
};
const alertChangeLocation = (id, position) => {
  Alert.alert(
    'Confirm',
    "You are outside the range of the retailer.\n\nDo want to update the retailer's location to the current location?",
    [
      {
        text: 'OK',
        onPress: () => {
          updateCustomerLocation(id, position);
        },
      },
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ],
    {cancelable: false},
  );
};

export const updateCustomerLocation = (id, location) => {
  updateShopLocation(id, location)
    .then(res => {
      console.log(res.data);
      const {data, errors, success} = res.data;
      if (success) {
        Alert.alert('Success', 'Location has been updated');
      } else if (errors) {
        Alert.alert('Error', Object.values(errors).join(', '));
      }
    })
    .catch(e => {
      alert(e);
    });
};

export const postCustomerCheckIn = (location, navigation, updateLocation) => {
  return async dispatch => {
    CustomerCheckIn(location)
      .then(res => {
        const {data, errors, success} = res.data;
        console.log(res.data);
        if (success) {
          dispatch(getCustomerVisitStatus());
          mmkv.setString('checked_in_at', dayjs().toISOString());
        } else if (errors) {
          dispatch(storeCustomerVisitStatusLoading(false));
          if (errors.check_in == 'out_of_range') {
            alertChangeLocation(updateLocation.customer_id, updateLocation);
            return;
          }

          if (errors.check_in === 'feedback_pending') {
            alert('Feedback pending');
            navigation.navigate(ROUTES.feedback, {checkStatus: false});
            return;
          }
          Alert.alert('Error', Object.values(errors).join(', '));
        }
      })
      .catch(e => {
        alert(e);
        dispatch(storeCustomerVisitStatusLoading(false));
      });
  };
};

export const postCustomerCheckOut = (location, navigation, screen) => {
  return async dispatch => {
    CustomerCheckOut(location)
      .then(res => {
        const {data, errors, success} = res.data;

        if (success) {
          dispatch(getCustomerVisitStatus());
          if (location.feedbacks) {
            navigation.goBack();
          }
        } else if (errors) {
          dispatch(storeCustomerVisitStatusLoading(false));
          if (errors.feedbacks) {
            if (screen === 'FeedbackScreen') {
              Alert.alert('Denied', errors.feedbacks);
              return;
            }

            navigation.navigate(ROUTES.feedback, {
              checkStatus: true,
              location,
            });
            return;
          }
          Alert.alert('Errors', Object.values(errors).join(', '));
        }
      })
      .catch(e => {
        alert(e);
        dispatch(storeCustomerVisitStatusLoading(false));
      });
  };
};

export const storeCustomerVisitStatus = payload => {
  return {type: orderAction.STORE_CUSTOMER_VISIT_STATUS, payload};
};

export const storeCustomerVisitStatusLoading = payload => {
  return {type: orderAction.STORE_CHECK_VISIT_LOADING, payload};
};

export const storeHideCheckoutAfterOrderPlaces = payload => {
  return {type: orderAction.STOTE_HIDE_CHECKOUT_AFTER_ORDER, payload};
};

export const storeCustomerForOrderOnCall = payload => {
  return {type: orderAction.STORE_CUSTOMER_FOR_ORDER_ON_CALL, payload};
};
