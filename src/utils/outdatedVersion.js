import {Alert, Linking} from 'react-native';
import VersionNumber from 'react-native-version-number';

const outdatedVersion = () => {
  Alert.alert('New Update Available', 'Please update your app', [
    {
      text: 'Update',
      onPress: async () => {
        const url = 'market://details?id=' + VersionNumber.bundleIdentifier;
        const canOpen = await Linking.canOpenURL(url);

        if (canOpen) {
          Linking.openURL(url);
        }
      },
    },
  ]);
};

export default outdatedVersion;
