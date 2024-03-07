import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import codePush from 'react-native-code-push';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';

import store from './src/store';
import theme from './src/constants/theme';
import AppNavigation from './src/navigation';

const codePushOptions = {checkFrequency: codePush.CheckFrequency.ON_APP_RESUME};

const App = () => {
  // useEffect(() => {
  //   codePush.sync({
  //     updateDialog: false,
  //     installMode: codePush.InstallMode.IMMEDIATE,
  //   });
  // }, []);

  return (
    <PaperProvider theme={theme}>
      <Provider store={store}>
        <NavigationContainer>
          {/* <StatusBar animated={true} backgroundColor={COLORS.primary} /> */}
          <AppNavigation />
        </NavigationContainer>
      </Provider>
    </PaperProvider>
  );
};

export default codePush(codePushOptions)(App);
