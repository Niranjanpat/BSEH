import {
  DistributorCheckIn,
  DistributorCheckOut,
  DistributorVisitStatus,
} from '../../services/distributor_visit_service';
import {Alert} from 'react-native';
import {storeIsInvalid} from './auth';
import {distributorAction} from '../action_types';

import {ROUTES} from '../../constants/routes';
import outdatedVersion from '../../utils/outdatedVersion';
import {updateShopLocation} from '../../services/retailer_services';
import MMKVStorage from 'react-native-mmkv-storage';
import dayjs from 'dayjs';

const mmkv = new MMKVStorage.Loader().initialize();

export const getDistributorVisitStatus = () => {
  return async dispatch => {
    DistributorVisitStatus()
      .then(res => {
        const {data, errors, success} = res.data;
        console.log(data);
        if (success) {
          dispatch(storeDistributorVisitStatus(data));
        } else {
        }
      })
      .catch(e => {
        alert(e);
      })
      .finally(() => {
        dispatch(storeDistributorVisitStatusLoading(false));
      });
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
      } else {
        Alert.alert('Error', JSON.stringify(errors));
      }
    })
    .catch(e => {
      alert(e);
    });
};

export const postDistributorCheckIn = (location, navigation) => {
  return async dispatch => {
    DistributorCheckIn(location)
      .then(res => {
        const {data, errors, success} = res.data;
        console.log(res.data);
        if (success) {
          dispatch(getDistributorVisitStatus());
          mmkv.setString('checked_in_at', dayjs().toISOString());
        } else {
          dispatch(storeDistributorVisitStatusLoading(false));
          if (errors.check_in == 'out_of_range') {
            alertChangeLocation(location.distributor_id, location);
            return;
          }

          if (errors.check_in === 'feedback_pending') {
            alert('Feedback pending');
            navigation.navigate(ROUTES.distributor_feedback, {checkStatus: false});
            return;
          }

          alert(JSON.stringify(errors));
        }
      })
      .catch(e => {
        alert(e);
        dispatch(storeDistributorVisitStatusLoading(false));
      });
  };
};

export const postDistributorCheckOut = (location, navigation, screen) => {
  return async dispatch => {
    DistributorCheckOut(location)
      .then(res => {
        const {data, errors, success} = res.data;

        if (success) {
          dispatch(getDistributorVisitStatus());
          if (location.feedbacks) {
            navigation.goBack();
          }
        } else {
          dispatch(storeDistributorVisitStatusLoading(false));
          if (errors.feedbacks) {
            if (screen === 'FeedbackScreen') {
              Alert.alert('Denied', errors.feedbacks);
              return;
            }

            navigation.navigate(ROUTES.distributor_feedback, {
              checkStatus: true,
              location,
            });
            return;
          }
          Alert.alert('Errors', JSON.stringify(errors));
        }
      })
      .catch(e => {
        alert(e);
        dispatch(storeDistributorVisitStatusLoading(false));
      });
  };
};

export const storeDistributorVisitStatus = payload => {
  return {type: distributorAction.STORE_DISTRIBUTOR_VISIT_STATUS, payload};
};

export const storeDistributorVisitStatusLoading = payload => {
  return {type: distributorAction.STORE_CHECK_VISIT_LOADING, payload};
};
