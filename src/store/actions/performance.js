import {Alert} from 'react-native';
import {
  achievements,
  currentOverAllTargetsAmount,
  todaysOrder,
} from '../../services/performance_service';
import {performanceAction} from '../action_types';
export const getTodaysOrder = data => {
  return async dispatch => {
    todaysOrder(data)
      .then(res => {
        const {data, errors, success} = res.data;
        if (success) {
          dispatch(storeTodaysOrder(data));
        } else if (errors) {
          Alert.alert(null, Object.values(errors).join(', '));
        }
      })
      .catch(e => {
        console.log('todaysOrder', e);
      });
  };
};
export const getTotalAchievements = () => {
  return async dispatch => {
    achievements()
      .then(res => {
        const {data, errors, success} = res.data;
        console.log('achievement', res.data);
        if (success) {
          dispatch(storeAchievementAmount(data.total_achievements));
        } else {
          //  Alert.alert(null, Object.values(errors).join(', '));
        }
      })
      .catch(e => {
        console.log('getTotalAchievements', e);
      });
  };
};
export const getCurrentOverAllTargetsAmount = () => {
  return async dispatch => {
    currentOverAllTargetsAmount()
      .then(res => {
        console.log('target response', res);

        const {data, errors, success} = res.data;

        console.log('target', res.data);

        console.log({getCurrentOverAllTargetsAmount: res.data});
        if (success) {
          dispatch(storeCurrentOverAllTargetsAmount(data));
        } else if (errors) {
            Alert.alert('Error', Object.values(errors).join(', '));
        }
      })
      .catch(e => {
        console.log('getCurrentOverAllTargetsAmount', e);
      });
  };
};
export const storeTodaysOrder = payload => {
  return {type: performanceAction.STORE_TODAYS_ORDER, payload};
};

export const storeAchievementAmount = payload => {
  return {type: performanceAction.STORE_ACHIEVEMENT_AMOUNT, payload};
};

export const storeCurrentOverAllTargetsAmount = payload => {
  return {type: performanceAction.STORE_OVERALL_TARGET_AMOUNT, payload};
};
