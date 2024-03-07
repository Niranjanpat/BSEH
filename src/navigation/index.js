import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AuthStack from './AuthStack';
import BottomTabStack from './BottomTabStack';

import {ROUTES} from '../constants/routes';
import {useSelector} from 'react-redux';
import SplashScreen from '../screens/SplashScreen';

const {Navigator, Screen} = createNativeStackNavigator();

export default function AppNavigation() {
  const [isLoading, setIsLoading] = useState(true);
  const {token} = useSelector(state => state.auth);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2500);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={token ? ROUTES.bottomtab_stack : ROUTES.auth_stack}>
      <Screen name={ROUTES.auth_stack} component={AuthStack} />
      <Screen name={ROUTES.bottomtab_stack} component={BottomTabStack} />
    </Navigator>
  );
}
