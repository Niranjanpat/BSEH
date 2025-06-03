import {attendanceAction, authActions} from '../action_types';

const initialStore = {
  token: null,
  role: '',
  profile: {},
  isInvalid: false,
  attendanceStatus: false,
  attendanceList: [],
  attendanceLoading: false,
  jointStatus: {},
  kilomerters: {},
};

const authReducer = (state = initialStore, action) => {
  const {type, payload} = action;

  switch (type) {
    case authActions.STORE_ACCOUNT_DETAILS:
      return {...state, profile: payload};
    case authActions.STORE_JOINT_STATUS:
      return {...state, jointStatus: payload};
    case authActions.STORE_ROLE:
      return {...state, role: payload};

    case authActions.STORE_TOEKN:
      return {...state, token: payload, isInvalid: false};

    case authActions.STORE_ISINVALID:
      return {...state, isInvalid: payload, token: null};

    case attendanceAction.STORE_ATTENDANCE_STATUS:
      return {...state, attendanceStatus: payload};

    case attendanceAction.STORE_ATTENDANCE_LIST:
      return {...state, attendanceList: payload};

    case attendanceAction.STORE_ATTENDANCE_LOADING:
      return {...state, attendanceLoading: payload};

    case attendanceAction.STORE_KILOMETERS:
      return {...state, kilomerters: payload};
      
    default:
      return state;
  }
};

export default authReducer;
