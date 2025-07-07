import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Polyline, Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {getUserTracking} from '../../../services/userHierarchy_service';
const UserTracking = ({navigation, route}) => {
  const [data, setData] = useState([]);
  const [firstCoord, ...rest] = data;
  const [lastCoord] = rest.reverse();
  useEffect(() => {
    if (route.params?.date) {
      getGeolocation(dayjs(route.params.date).format('YYYY-MM-DD'));
    } else {
      getGeolocation(dayjs().format('YYYY-MM-DD'));
    }
  }, []);

  const getGeolocation = date => {
    getUserTracking(
      `geolocations?date=${date}&user_id=${route.params.id}`,
    ).then(res => {
      const {data, errors, success} = res.data;
      console.log(data, date);
      if (success) {
        setData(data.geolocations);
      } else if (errors) {
        alert(Object.values(errors).join(', '));
      }
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={{
          latitude: lastCoord ? lastCoord.latitude : 37.78825,
          longitude: lastCoord ? lastCoord.longitude : -122.4324,
          latitudeDelta: 2.41,
          longitudeDelta: 2.41,
        }}>
        <Polyline
          coordinates={data}
          strokeColor="blue" // fallback for when `strokeColors` is not supported by the map-provider
          strokeWidth={3}
        />
        {firstCoord && firstCoord.latitude && firstCoord.longitude && (
          <Marker
            pinColor="red"
            title={firstCoord.address}
            coordinate={firstCoord}
          />
        )}

        {lastCoord && lastCoord.latitude && lastCoord.longitude && (
          <Marker
            title={firstCoord.address}
            pinColor="green"
            coordinate={lastCoord}
          />
        )}
      </MapView>
    </View>
  );
};

export default UserTracking;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
