import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SignInScreen from '../screens/SignInScreen';
import LoginScreen from '../screens_new/LoginScreen';

const {Navigator, Screen} = createNativeStackNavigator();
const AuthStackNavigation = () => {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Screen name="SignInScreen" component={LoginScreen} />
    </Navigator>
  );
};

export default AuthStackNavigation;
