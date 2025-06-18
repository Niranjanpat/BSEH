import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {ROUTES} from '../../constants/routes';

import SampleListScreen from '../../screens/Settings/sample/SampleListScreen';
import SampleDetailScreen from '../../screens/Settings/sample/SampleDetailScreen';

const {Navigator, Screen} = createNativeStackNavigator();
export const SampleStack = () => {
  return (
    <Navigator
      initialRouteName={ROUTES.sample}
      screenOptions={{animation: 'slide_from_right'}}>
      <Screen
        name={ROUTES.sample}
        component={SampleListScreen}
        options={{title: 'Samples'}}
      />

      <Screen
        name={ROUTES.sample_detail}
        component={SampleDetailScreen}
        options={({route}) => ({
          title: route.params.item.customer || 'Sample Detail',
        })}
      />
    </Navigator>
  );
};
