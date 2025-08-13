import { combineReducers } from 'redux';
const auth = (state = { user: null }, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
};
export default combineReducers({ auth });