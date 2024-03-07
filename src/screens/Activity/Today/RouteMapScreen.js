import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, Alert} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Polyline, Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {activityGeolocation} from '../../../services/activity_service';
const RouteMapScreen = ({navigation, route}) => {
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
    console.log(date);
    activityGeolocation(date).then(res => {
      const {data, errors, success} = res.data;
      console.log(data, date);
      if (success) {
        setData(data.geolocations);
        if (data.geolocations.length == 0) {
          Alert.alert('Location is not available');
        }
      } else {
        alert(JSON.stringify(errors));
      }
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={{
          latitude: lastCoord ? lastCoord.latitude : 20.7505815,
          longitude: lastCoord ? lastCoord.longitude : 73.7303493,
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

export default RouteMapScreen;

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
