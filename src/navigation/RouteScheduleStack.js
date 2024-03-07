import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {ROUTES} from '../constants/routes';
import RouteScheduleListScreen from '../screens/Settings/route_schedule';
import AddRouteScheduleScreen from '../screens/Settings/route_schedule/AddRouteScheduleScreen';
import RouteScheduleDetailsScreen from '../screens/Settings/route_schedule/RouteScheduleDetailsScreen';
import UpdateRouteScheduleScreen from '../screens/Settings/route_schedule/UpdateRouteScheduleScreen';

const {Navigator, Screen} = createNativeStackNavigator();

const RouteScheduleStack = () => {
  return (
    <Navigator screenOptions={{animation: 'slide_from_right'}}>
      <Screen
        name={ROUTES.route_schedule_list}
        component={RouteScheduleListScreen}
        options={{headerTitle: 'Schedule list'}}
      />
      <Screen
        name={ROUTES.add_route_schedule}
        component={AddRouteScheduleScreen}
        options={{headerTitle: 'Add route schedule'}}
      />
      <Screen
        name={ROUTES.route_schedule_details}
        component={RouteScheduleDetailsScreen}
        options={{headerTitle: 'Schedule details'}}
      />
      <Screen
        name={ROUTES.update_route_schedule}
        component={UpdateRouteScheduleScreen}
        options={{headerTitle: 'Update schedule'}}
      />
    </Navigator>
  );
};

export default RouteScheduleStack;
