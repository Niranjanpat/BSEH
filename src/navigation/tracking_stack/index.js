import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {ROUTES} from '../../constants/routes';
import UserListScreen from '../../screens/Settings/tracking/UserListScreen';
import UserTracking from '../../screens/Settings/tracking/UserTracking';

const {Navigator, Screen} = createNativeStackNavigator();

export const TrackingStack = () => {
  return (
    <Navigator screenOptions={{animation: 'slide_from_right'}}>
      <Screen
        name={ROUTES.user_list}
        component={UserListScreen}
        options={{title: 'User List'}}
      />
      <Screen
        name={ROUTES.tracking_user}
        component={UserTracking}
        options={{title: 'Tracking'}}
      />
    </Navigator>
  );
};
