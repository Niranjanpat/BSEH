import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {ROUTES} from '../constants/routes';
import UserDistributorScheduleList from '../screens/Settings/user_distributor_schedule/UserDistributorScheduleList'

const {Navigator, Screen} = createNativeStackNavigator();

const UserDistributorScheduleStack = () => {
  return (
    <Navigator screenOptions={{animation: 'slide_from_right'}}>
      <Screen
        name={ROUTES.user_distributor_schedule_list}
        component={UserDistributorScheduleList}
        options={{headerTitle: 'User Distributor Schedule list'}}
      />
    </Navigator>
  );
};

export default UserDistributorScheduleStack;
