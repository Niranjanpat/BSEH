import {View, Text, Alert} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import Geolocation from 'react-native-geolocation-service';
import {stylesSupplier} from '../../../screens/Settings/suppliers/styles/SupplierStyles';
import {ActivityIndicator, TextInput} from 'react-native-paper';
import usePermissions from '../../../hooks/usePermissions';
import {COLORS} from '../../../constants/theme/colors';

const CurrentLocationView = ({onSetLocation}) => {
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoading] = useState(false);

  const {askLocationPermission} = usePermissions();

  useEffect(() => {
    if (location) {
      onSetLocation(location);
    }
  }, [location]);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const granted = await askLocationPermission();

      if (granted) {
        console.log(granted);

        Geolocation.getCurrentPosition(
          position => {
            var data = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setLocation(data);
            setLoading(false);
          },
          error => {
            console.log(error.code, error.message);
            setLoading(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          },
        );
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      Alert.alert('Location Error!', JSON.stringify(e));
    }
  };

  return (
    <View style={stylesSupplier.locationViewContainer}>
      <TextInput
        style={[stylesSupplier.input, stylesSupplier.locationInput]}
        value={
          location?.latitude ? location?.latitude + ', ' + location?.longitude : ''
        }
        editable={false}
        label="GPS Location"
        placeholder="Press on the icon at right"
        right={
          <TextInput.Icon
            icon="map-marker-radius-outline"
            onPress={() => getCurrentLocation()}
            color={COLORS.primary}
          />
        }
      />
      {loadingLocation && <ActivityIndicator style={stylesSupplier.loading} />}
    </View>
  );
};

export default memo(CurrentLocationView);
