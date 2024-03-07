import {performanceAction} from '../action_types';

const initialStore = {
  todaysOrder: {},
  todaysKMSOrder: {},
  totalAchievements: null,
  overallAmountTarget: null,
};

const performanceReducer = (state = initialStore, action) => {
  const {type, payload} = action;

  switch (type) {
    case performanceAction.STORE_TODAYS_ORDER:
      return {...state, todaysOrder: payload};
    case performanceAction.STORE_TODAYS_KMS_ORDER:
      return {...state, todaysKMSOrder: payload};
    case performanceAction.STORE_ACHIEVEMENT_AMOUNT:
      return {...state, totalAchievements: payload};
    case performanceAction.STORE_OVERALL_TARGET_AMOUNT:
      return {...state, overallAmountTarget: payload};
    default:
      return state;
  }
};

export default performanceReducer;
