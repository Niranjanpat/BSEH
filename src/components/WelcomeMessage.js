import dayjs from 'dayjs';
import React, {useEffect, useRef, useState, memo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet} from 'react-native';
import {
  Button,
  Text,
  Avatar,
  IconButton,
  ActivityIndicator,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {COLORS} from '../constants/theme/colors';
import MapplsIntouch from 'mappls-intouch-react-native';
import {ROUTES} from '../constants/routes';
import ListModal from './ListModal';
import {useAttendance} from '../hooks/useAttendance';

const WelcomeMessage = () => {
  const hourOfDay = dayjs().format('H');
  const {profile, attendanceStatus, jointStatus, role} =
    useSelector(state => state.auth);
  const [greeting, setGreeting] = useState('Good Morning');
  const navigation = useNavigation();
  const presentRef = useRef();
  const absentRef = useRef();
  const [channel, setChannel] = useState(null);
  const [selection, setSelection] = useState(null);

  const {loading, checkAttendanceStatus} = useAttendance();

  useEffect(() => {
    if (!selection) {
      checkAttendanceStatus(setSelection);
    }
  }, []);

  useEffect(() => {
    generateGreetings();
    trackingOn();
  }, [hourOfDay]);

  const trackingOn = async () => {
    if (attendanceStatus) {
      const status = await MapplsIntouch.isRunning();
      console.log('mappls running', status);
      if (!status) {
        MapplsIntouch.startTrackingWithCustomConfig({
          standByTimeInMins: 15, //mandatory
          timeWhileMovingInSec: 10, //mandatory enableRequestPermissionIfMissing:true
          autoTrackingConfig: {
            endTimeConfig: {hour: 10, minute: 0, amPm: 'pm'},
          },
        });
      }
    } else {
      MapplsIntouch.stopTracking();
    }
  };

  function generateGreetings() {
    if (hourOfDay >= 3 && hourOfDay < 12) {
      setGreeting('Good Morning');
    } else if (hourOfDay >= 12 && hourOfDay <= 16) {
      setGreeting('Good Afternoon');
    } else if (hourOfDay > 16 && hourOfDay < 20) {
      setGreeting('Good Evening');
    } else {
      setGreeting('Good Night');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Avatar.Text
          style={styles.avatar}
          size={50}
          label={profile.name ? profile.name.charAt(0) : 'P'}
        />
        <View>
          <Text numberOfLines={1} style={styles.greetingText}>
            {greeting}! {profile.name}
          </Text>
          <View style={{flex: 1}}>
            <Text style={styles.status}>
              Availability{' '}
              <Icon
                name="check-decagram"
                size={16}
                color={attendanceStatus ? COLORS.success : COLORS.error}
              />
            </Text>
            {/* <Text style={styles.status}>
              Travel Distance:{` ${travelDistance} KM`}
            </Text> */}
          </View>
        </View>

        {/* <View style={{flex: 1, alignItems: 'flex-end'}}>
          {!(
            role == 'sales-officer' ||
            role == 'kam' ||
            role == 'promoter'
          ) && (
            <IconButton
              size={30}
              color={COLORS.primary}
              icon="account-multiple-plus"
              disabled={jointStatus?.status ? true : false}
              onPress={() => navigation.navigate(ROUTES.joint_work)}
            />
          )}
        </View> */}
      </View>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View
          style={[
            styles.row,
            {justifyContent: 'flex-end', alignItems: 'flex-end'},
          ]}>
          {selection === null && (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}>
              <>
                <Button
                  onPress={() => {
                    setChannel('Present');
                    presentRef.current?.showList(true);
                  }}
                  mode="contained"
                  style={{backgroundColor: 'green'}}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: 'bold',
                      color: COLORS.light,
                    }}>
                    Mark as Present
                  </Text>
                </Button>
                <ListModal
                  channel={channel}
                  setSelection={setSelection}
                  ref={presentRef}
                />
              </>
              <>
                <Button
                  onPress={() => {
                    setChannel('Absent');
                    absentRef.current?.showList(true);
                  }}
                  mode="contained"
                  style={{backgroundColor: 'red'}}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: 'bold',
                      color: COLORS.light,
                    }}>
                    Mark as Absent
                  </Text>
                </Button>
                <ListModal
                  channel={channel}
                  ref={absentRef}
                  setSelection={setSelection}
                />
              </>
            </View>
          )}
          {(selection?.toLowerCase()) === 'present' && (
            <Button
              onPress={() => navigation.navigate('AttendanceScreen')}
              icon={() => (
                <Icon name="calendar-check" size={20} color={COLORS.light} />
              )}
              mode="contained">
              <Text
                style={{fontSize: 12, fontWeight: 'bold', color: COLORS.light}}>
                Take attendance
              </Text>
            </Button>
          )}
          {(selection?.toLowerCase()) === 'absent' && (
            <View style={{flexDirection: 'row'}}>
              <Text style={{color: 'black', fontWeight: 'bold'}}>
                Status :{' '}
              </Text>
              <Text style={{color: 'black'}}>You are absent today.</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default memo(WelcomeMessage);

const styles = StyleSheet.create({
  container: {
    padding: 10,
    width: '100%',
  },
  avatar: {
    marginRight: 10,
  },
  greetingText: {
    fontSize: 17,
    marginBottom: 2,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    paddingBottom: 10,
    alignItems: 'center',
  },
  status: {
    marginLeft: 5,
    flexWrap: 'wrap',
  },
});
