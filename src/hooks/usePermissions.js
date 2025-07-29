import {Alert, Linking, Platform} from 'react-native';
import {
  PERMISSIONS,
  checkMultiple,
  requestMultiple,
} from 'react-native-permissions';

const isAndroid = Platform.OS === 'android';

const usePermissions = () => {
  const askLocationPermission = async () => {
    try {
      const PERMISSIONS_TO_CHECK = isAndroid
        ? [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]
        : [
            PERMISSIONS.IOS.LOCATION_ALWAYS,
            PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
          ];

      const status = await checkMultiple(PERMISSIONS_TO_CHECK);

      if (
        status['android.permission.ACCESS_FINE_LOCATION'] === 'granted' ||
        status['ios.permission.LOCATION_ALWAYS'] === 'granted' ||
        status['ios.permission.LOCATION_WHEN_IN_USE' === 'granted'] ||
        status['android.permission.ACCESS_FINE_LOCATION'] === 'limited' ||
        status['ios.permission.LOCATION_ALWAYS'] === 'limited' ||
        status['ios.permission.LOCATION_WHEN_IN_USE' === 'limited']
      ) {
        return true;
      } else {
        const granted = await requestMultiple(PERMISSIONS_TO_CHECK);

        if (
          granted['android.permission.ACCESS_FINE_LOCATION'] === 'granted' ||
          granted['android.permission.ACCESS_FINE_LOCATION'] === 'limited' ||
          granted['ios.permission.LOCATION_ALWAYS'] === 'granted' ||
          granted['ios.permission.LOCATION_ALWAYS'] === 'limited' ||
          granted['ios.permission.LOCATION_WHEN_IN_USE'] === 'granted' ||
          granted['ios.permission.LOCATION_WHEN_IN_USE'] === 'limited'
        ) {
          return true;
        } else {
          Alert.alert(
            'Error',
            'Location permission not given, turn it from settings',
            [
              {
                text: 'Ask me later',
              },
              {
                text: 'Go to settings',
                onPress: () => Linking.openSettings(),
              },
            ],
          );
          return false;
        }
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Permission error', JSON.stringify(err));

      return false;
    }
  };

  return {askLocationPermission};
};

export default usePermissions;
