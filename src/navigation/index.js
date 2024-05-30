import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AuthStack from './AuthStack';
import BottomTabStack from './BottomTabStack';

import {ROUTES} from '../constants/routes';
import {useSelector} from 'react-redux';
import SplashScreen from '../screens/SplashScreen';
import { Alert, AppState, BackHandler, Platform } from 'react-native';
import JailMonkey from 'jail-monkey';

const {Navigator, Screen} = createNativeStackNavigator();

const isAndroid = Platform.OS === 'android';

export default function AppNavigation() {
  const [isLoading, setIsLoading] = useState(true);
  const {token} = useSelector(state => state.auth);

  useEffect(() => {
    check();

    const subscribe = AppState.addEventListener('change', state => {
      if (state === 'active') {
        check();
      }
    });
    setTimeout(() => setIsLoading(false), 2500);

    return () => subscribe.remove();
  }, []);

  const check = async () => {
    try {
      if (isAndroid) {
        const isDevModeOn = await JailMonkey.isDevelopmentSettingsMode();

        if (isDevModeOn) {
          Alert.alert(
            'Dev mode on',
            'Your mobile device has developer option enabled. \n Please turn the option off and restart the app in order to continue.',
            [
              {
                text: 'OK',
                onPress: () => BackHandler.exitApp(),
              },
            ],
            {cancelable: false},
          );
          return;
        }
      }
    } catch (err) {
      console.log('err', err);
    }
  };

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
