import dayjs from 'dayjs';
import {
  attendanceList,
  attendanceStatus,
  profile,
  punchIn,
  punchOut,
} from '../../services/auth_service';
import {clientId, clientSecret} from '../../constants/urls';
import {attendanceAction, authActions} from '../action_types';
import MapplsIntouch from 'mappls-intouch-react-native';
import {getJointWorkStatus} from '../../services/joint_service';
import {Alert} from 'react-native';

export const getProfileDetail = () => {
  return async dispatch => {
    profile()
      .then(res => {
        const {data, errors, success} = res.data;
        console.log('Profile', data);
        if (success) {
          dispatch(storeAccount(data));
          intouch(data);
        } else {
        }
      })
      .catch(e => {
        console.log('getProfileDetail', e);
      });
  };
};
export const fetchJointWorkStatus = () => {
  return async dispatch => {
    getJointWorkStatus()
      .then(res => {
        const {data, errors, success} = res.data;
        if (success) {
          dispatch(storeJointStatus(data));
          console.log(data);
        } else {
          dispatch(storeJointStatus(null));
        }
      })
      .catch(e => {
        console.log('getJointStatus', e);
      });
  };
};
const intouch = async profile => {
  const status = await MapplsIntouch.isInitialized();
  console.log(status);
  if (!status) {
    try {
      MapplsIntouch.initializeWithDeviceId(
        profile.emp_code,
        clientId,
        clientSecret,
        profile.emp_code,
        result => {
          console.log('intouchs', result);
          if (result === 'success') {
            MapplsIntouch.addTrackingStateListener(event => {
              console.log('intouch', event);
            });
          } else {
            alert('Tracking Initialization fail');
          }
        },
      );
    } catch (e) {
      console.log(e);
    }
  } else {
    console.log('intouch already called');
  }
};

export const getAttendanceList = () => {
  return async dispatch => {
    attendanceList(dayjs().format('YYYY-MM-DD'))
      .then(res => {
        const {data, errors, success} = res.data;
        if (success) {
          dispatch(storeAttendanceList(data.attendances));
        } else {
          console.log(errors);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
};
export const attendancePunchIn = data => {
  return async dispatch => {
    dispatch(storeAttendanceLoading(true));

    try {
      const res = await punchIn(data);
      const { data: responseData, errors, success } = res?.data ?? {};

      if (success) {
        dispatch(getAttendanceStatus());
        dispatch(getAttendanceList());

        MapplsIntouch.startTrackingWithCustomConfig({
          standByTimeInMins: 15,
          timeWhileMovingInSec: 10,
          autoTrackingConfig: {
            endTimeConfig: { hour: 10, minute: 0, amPm: 'pm' },
          },
          displacement: 50
        });

        MapplsIntouch.getCurrentLocationUpdate();
      } else if (errors) {
        Alert.alert('Error!', Object.values(errors).join(', '));
      }
    } catch (error) {
      console.error('Punch-in error:', error);
      Alert.alert('Error', 'Something went wrong during punch-in.');
    } finally {
      dispatch(storeAttendanceLoading(false));
    }
  };
};


export const attendancePunchOut = data => {
  return async dispatch => {
    dispatch(storeAttendanceLoading(true));
    punchOut(data)
      .then(res => {
        const {data, errors, success} = res.data;
        console.log('response data', res.data);
        if (success) {
          MapplsIntouch.getCurrentLocationUpdate();
          dispatch(getAttendanceStatus());
          dispatch(getAttendanceList());
          dispatch(storeJointStatus(null));
          MapplsIntouch.stopTracking();
        } else {
          if (errors) {
            Alert.alert('Error!', Object.values(errors).join(', '));
          }
          dispatch(storeAttendanceLoading(false));
        }
      })
      .catch(e => {
        console.log('punchOut error', e);
        dispatch(storeAttendanceLoading(false));
      });
  };
};

export const getAttendanceStatus = () => {
  return async dispatch => {
    attendanceStatus()
      .then(res => {
        const {data, errors, success} = res.data;
        console.log('attendance', data);
        if (success) {
          dispatch(storeAttendanceStatus(data.status));
          dispatch(
            storeKilometers({
              vehicleType: data.vehicle_type,
              startVehicleKm: data.start_vehicle_km,
            }),
          );
        } else {
          if (errors) {
            Alert.alert('Error!', Object.values(errors).join(', '));
          }
        }
      })
      .catch(e => {
        console.log('getAttendanceStatus', e);
        // Alert.alert('getAttendanceStatus', e);
      })
      .finally(() => {
        dispatch(storeAttendanceLoading(false));
      });
  };
};

export const storeRole = payload => {
  return {type: authActions.STORE_ROLE, payload};
};
export const storeJointStatus = payload => {
  return {type: authActions.STORE_JOINT_STATUS, payload};
};
export const storeToken = payload => {
  return {type: authActions.STORE_TOEKN, payload};
};

export const storeAccount = payload => {
  return {type: authActions.STORE_ACCOUNT_DETAILS, payload};
};

export const storeIsInvalid = payload => {
  return {type: authActions.STORE_ISINVALID, payload};
};

export const storeAttendanceStatus = payload => {
  return {type: attendanceAction.STORE_ATTENDANCE_STATUS, payload};
};

export const storeKilometers = payload => {
  return {type: attendanceAction.STORE_KILOMETERS, payload};
};

export const storeAttendanceList = payload => {
  return {type: attendanceAction.STORE_ATTENDANCE_LIST, payload};
};

export const storeAttendanceLoading = payload => {
  return {type: attendanceAction.STORE_ATTENDANCE_LOADING, payload};
};
