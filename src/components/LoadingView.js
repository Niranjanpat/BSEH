import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ActivityIndicator, Portal} from 'react-native-paper';
import {COLORS} from '../constants/theme/colors';

const LoadingView = () => {
  return (
    <Portal>
      <View style={styles.container}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    opacity: 0.4,
    backgroundColor: COLORS.lightGrey,
  },
});

export default LoadingView;
