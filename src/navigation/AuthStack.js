import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SignInScreen from '../screens/SignInScreen';

const {Navigator, Screen} = createNativeStackNavigator();
const AuthStackNavigation = () => {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Screen name="SignInScreen" component={SignInScreen} />
    </Navigator>
  );
};

export default AuthStackNavigation;
