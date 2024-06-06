import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Appbar,
  Subheading,
  Switch,
  Text,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {View, StyleSheet, FlatList, Alert} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import {
  attendancePunchIn,
  attendancePunchOut,
  getAttendanceList,
  storeAttendanceLoading,
} from '../../store/actions/auth';
import useLocationPermission from '../../utils/useLocationPermission';
import ScheduleSummaryModal from '../../components/ScheduleSummaryModal';
import {COLORS} from '../../constants/theme/colors';

const AttendanceScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const {attendanceStatus, attendanceList, attendanceLoading, role} =
    useSelector(state => state.auth);

  const {customerVisitStatus} = useSelector(state => state.order);

  const [requestLocationPermission] = useLocationPermission();
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);

  useEffect(() => {
    requestLocationPermission();
    dispatch(getAttendanceList());
  }, []);

  return (
    <View style={{flex: 1}}>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title="Attendance" />
        <Appbar.Action
          icon="calendar-outline"
          onPress={() => navigation.navigate('AttendanceDetail')}
        />
      </Appbar.Header>

      <View style={styles.attendanceBox}>
        <Subheading style={styles.dateText}>
          {dayjs().format('YYYY MMM DD')}
        </Subheading>
        <View style={styles.attendanceContainer}>
          <Text style={styles.text}>Punch Out</Text>
          {attendanceLoading ? (
            <ActivityIndicator style={{marginHorizontal: 10}} />
          ) : (
            <Switch
              style={styles.switchStyle}
              onValueChange={_ => {
                dispatch(storeAttendanceLoading(true));
                Geolocation.getCurrentPosition(
                  position => {
                    var data = {
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                    };
                    if (attendanceStatus) {
                      if (customerVisitStatus.status) {
                        Alert.alert(
                          'Check out pending',
                          'Please check out from the customer in order to punch out.',
                        );
                        dispatch(storeAttendanceLoading(false));
                        return;
                      }

                      if (role === 'kam' || role === 'sales-officer') {
                        dispatch(storeAttendanceLoading(false));
                        setIsSummaryVisible(true);
                        return;
                      }

                      dispatch(attendancePunchOut(data));
                    } else {
                      dispatch(attendancePunchIn(data));
                    }
                  },
                  error => {
                    dispatch(storeAttendanceLoading(false));
                    console.log(error.code, error.message);
                  },
                  {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 10000,
                  },
                );
              }}
              value={attendanceStatus}
            />
          )}
          <Text style={styles.text}>Punch In</Text>
        </View>
        <View style={styles.attendanceListContainer}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 3,
                marginBottom: 3,
              }}>
              <Text
                style={{width: '50%', textAlign: 'center', fontWeight: 'bold'}}>
                Punch In
              </Text>
              <Text
                style={{width: '50%', textAlign: 'center', fontWeight: 'bold'}}>
                Punch Out
              </Text>
            </View>
          </View>
          <FlatList
            ListEmptyComponent={() => {
              return <Text>no data</Text>;
            }}
            data={attendanceList}
            keyExtractor={item => '' + item._id}
            renderItem={({item}) => {
              return (
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 3,
                      marginBottom: 3,
                    }}>
                    <Text style={{width: '50%', textAlign: 'center'}}>
                      {item.punch_in_time}
                    </Text>
                    <Text style={{width: '50%', textAlign: 'center'}}>
                      {item.punch_out_time}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        </View>
      </View>
      <ScheduleSummaryModal
        visible={isSummaryVisible}
        onClose={setIsSummaryVisible}
      />
    </View>
  );
};

export default AttendanceScreen;
const styles = StyleSheet.create({
  attendanceBox: {
    width: '100%',
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  switchStyle: {
    marginHorizontal: 10,
  },
  text: {
    marginTop: 5,
    color: COLORS.accentPrimary,
  },
  dateText: {
    color: COLORS.accentPrimary,
  },
  attendanceListContainer: {
    width: '90%',
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 50,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  attendanceContainer: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
  },
});
