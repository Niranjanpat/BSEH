import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import codePush from 'react-native-code-push';
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaView, StyleSheet } from 'react-native';

import store from './src/store';
import theme from './src/constants/theme';
import AppNavigation from './src/navigation';

const codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };

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
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <NavigationContainer
            theme={{
              ...NavigationDefaultTheme,
              colors: {
                ...NavigationDefaultTheme.colors,
                background: theme.colors.background,
              },
            }}
          >
            {/* <StatusBar animated={true} backgroundColor={COLORS.primary} /> */}
            <AppNavigation />
          </NavigationContainer>
        </SafeAreaView>
      </Provider>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default codePush(codePushOptions)(App);
