import React, {useEffect, memo, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {COLORS} from '../constants/theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Title, Text} from 'react-native-paper';
import {URLS} from '../constants/urls';
import client from '../services/axios_client';
const AttendanceSummary = () => {
  const [attendanceSummary, setAttendanceSummary] = useState({});
  useEffect(() => {
    getAttendanceSummary();
  }, []);

  const getAttendanceSummary = async () => {
    const url = URLS.attendanceSummary;
    try {
      const res = await client.get(url);
      console.log('attendance', res);
      const {data, errors, success} = res.data;
      if (success) {
        setAttendanceSummary(data);
      } else {
        Alert.alert('Oops', JSON.stringify(errors));
      }
    } catch (error) {
      console.log('getAttendanceSummary', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.boxView}>
        <Icon name="account-group-outline" size={40} color={COLORS.primary} />
        <Text>Total User</Text>
        <Title>{attendanceSummary.total_users}</Title>
      </View>
      <View style={styles.boxView}>
        <Icon name="account-check-outline" color={COLORS.primary} size={40} />
        <Text>Active User</Text>
        <Title>{attendanceSummary.present_users}</Title>
      </View>
    </View>
  );
};

export default memo(AttendanceSummary);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  boxView: {
    width: '50%',
    border: 1,
    backgroundColor: '#f6f6f6',
    margin: 10,
    alignItems: 'center',
    padding: 10,
  },
});
