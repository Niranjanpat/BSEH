import {Alert, StyleSheet, View} from 'react-native';
import React from 'react';
import {Button, Caption, Card, Text} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import Geolocation from 'react-native-geolocation-service';

import VerticalSpacer from '../components/VerticalSpacer';
import {COLORS} from '../constants/theme/colors';
import {postEndJointWork} from '../services/joint_service';
import {storeJointStatus} from '../store/actions/auth';

const JointWorkingView = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = React.useState(false);
  const {role, profile, jointStatus} = useSelector(state => state.auth);

  const endJointWorking = () => {
    Geolocation.getCurrentPosition(
      async position => {
        if (position) {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setIsLoading(true);
          try {
            const res = await postEndJointWork(location);

            const {success, errors} = res.data;

            if (success) {
              dispatch(storeJointStatus({}));
            } else {
              if (errors?.latitude || errors?.longitude) {
                return Alert.alert(
                  'Error',
                  'Location not provided. Check location permission and try again',
                );
              }

              Alert.alert(JSON.stringify(errors));
            }
          } catch (error) {
            console.log(error);
          } finally {
            setIsLoading(false);
          }
        }
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

  const handleEndCollab = () => {
    Alert.alert('Confirm', 'Are you sure you want to end this joint work?', [
      {
        text: 'Sure',
        style: 'destructive',
        onPress: endJointWorking,
      },

      {text: 'Cancel', style: 'default'},
    ]);
  };

  return (
    <>
      {jointStatus && jointStatus.status && (
        <Card style={styles.container}>
          <Caption style={styles.txtCollab} numberOfLines={1}>
            Joint work
          </Caption>
          <VerticalSpacer />
          <View style={styles.row}>
            <View style={[styles.details, {flex: 1}]}>
              <Text>Hello</Text>
            </View>
            <View style={[styles.details, {flex: 2}]}>
              <Caption>You are currently working with</Caption>
              <Text style={{fontWeight: 'bold', marginLeft: 20}}>
                {jointStatus.guest_name}
              </Text>
              <Caption style={{marginLeft: 30}}>
                ({jointStatus.guest_role})
              </Caption>
              <Button
                disabled={isLoading}
                loading={isLoading}
                onPress={handleEndCollab}
                style={styles.button}
                mode="contained">
                <Text style={{color: COLORS.light, fontSize: 10}}>Stop</Text>
              </Button>
            </View>
          </View>
        </Card>
      )}
    </>
  );
};

export default JointWorkingView;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 5,
  },

  txtCollab: {
    fontSize: 18,
    color: COLORS.primaryDark,
    alignSelf: 'center',
  },

  row: {
    marginBottom: 10,
    flexDirection: 'row',
  },

  details: {
    flex: 1,
    justifyContent: 'center',
  },

  button: {
    alignSelf: 'flex-end',
  },
});
