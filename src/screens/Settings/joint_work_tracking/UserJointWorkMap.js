import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getJointGeolocation} from '../../../services/joint_service';
import MapView, {PROVIDER_GOOGLE, Polyline, Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps

const UserJointWorkMap = ({route}) => {
  const {id} = route.params;
  const [guestGeolocation, setGuestGeolocation] = useState([]);
  const [hostGeolocation, setHostGeolocation] = useState([]);
  const [firstCoord, ...rest] = hostGeolocation;
  const [lastCoord] = rest.reverse();

  const [firstGuestCoord, ...rests] = guestGeolocation;
  const [lastGuestCoord] = rests.reverse();
  useEffect(() => {
    getJointGeolocation(id)
      .then(res => {
        const {data, success, error} = res.data;
        if (success) {
          setGuestGeolocation(data.guest_geolocations);
          setHostGeolocation(data.host_geolocations);
          console.log(data);
        } else {
        }
      })
      .catch(e => {});
  }, []);

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
          coordinates={guestGeolocation}
          strokeColor="blue" // fallback for when `strokeColors` is not supported by the map-provider
          strokeWidth={3}
        />
        <Polyline
          coordinates={hostGeolocation}
          strokeColor="red" // fallback for when `strokeColors` is not supported by the map-provider
          strokeWidth={3}
        />

        {firstGuestCoord &&
          firstGuestCoord.latitude &&
          firstGuestCoord.longitude && (
            <Marker
              pinColor="blue"
              description="Guest"
              title={firstGuestCoord.address}
              coordinate={firstGuestCoord}
            />
          )}

        {lastGuestCoord &&
          lastGuestCoord.latitude &&
          lastGuestCoord.longitude && (
            <Marker
              title={lastGuestCoord.address}
              description="Guest"
              pinColor="yellow"
              coordinate={lastGuestCoord}
            />
          )}
        {firstCoord && firstCoord.latitude && firstCoord.longitude && (
          <Marker
            pinColor="red"
            description="Host"
            title={firstCoord.address}
            coordinate={firstCoord}
          />
        )}

        {lastCoord && lastCoord.latitude && lastCoord.longitude && (
          <Marker
            title={firstCoord.address}
            description="Host"
            pinColor="green"
            coordinate={lastCoord}
          />
        )}
      </MapView>
    </View>
  );
};

export default UserJointWorkMap;

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
