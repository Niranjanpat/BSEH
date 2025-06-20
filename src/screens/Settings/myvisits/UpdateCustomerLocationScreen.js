import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {Button, Text, TextInput} from 'react-native-paper';
import Geolocation from 'react-native-geolocation-service';

import VerticalSpacer from '../../../components/VerticalSpacer';
import {updateShopLocation} from '../../../services/retailer_services';

const UpdateCustomerLocationScreen = ({route}) => {
  const customer = route.params.data;
  const customerID = route.params.id;

  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState({
    latitude: customer.latitude,
    longitude: customer.longitude,
  });

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        var data = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(data);
      },
      error => {
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  const handleSubmit = () => {
    setIsLoading(true);
    updateShopLocation(customerID, location)
      .then(res => {
        const {data, errors, success} = res.data;
        if (success) {
          alert('Customer location successfully updated!');
        } else {
          if (errors?.id) {
            return alert(errors.id);
          }
          if (errors) {
            alert(Object.values(errors).join(', '));
          }
        }
      })
      .catch(e => {
        console.log(e);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <View style={styles.container}>
      <Text>GPS Location</Text>
      <TextInput
        style={styles.input}
        value={location ? `${location.latitude}, ${location.longitude}` : ''}
        editable={false}
        placeholder="Press on the icon at right"
        mode="flat"
        right={
          <TextInput.Icon
            icon="map-marker-radius-outline"
            onPress={() => getCurrentLocation()}
          />
        }
      />
      <VerticalSpacer />
      <Button
        disabled={isLoading}
        style={styles.btn}
        onPress={handleSubmit}
        loading={isLoading}
        mode="contained">
        Submit
      </Button>
    </View>
  );
};

export default UpdateCustomerLocationScreen;

const styles = StyleSheet.create({
  input: {
    marginTop: 10,
    backgroundColor: 'white',
  },

  container: {
    flex: 1,
    padding: 10,
  },

  btn: {
    marginBottom: 25,
    marginTop: 10,
  },
});
