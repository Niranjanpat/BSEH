import React, {useEffect, memo, useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {COLORS} from '../constants/theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Title, Text, Avatar, Subheading} from 'react-native-paper';
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
      const {data, errors, success} = res.data;
      if (success) {
        setAttendanceSummary(data);
      } else if (errors) {
        Alert.alert('Error!', Object.values(errors).join(', '));
      }
    } catch (error) {
      console.log('getAttendanceSummary', error);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Avatar.Icon
          size={35}
          style={styles.avatar}
          icon="account-group"
          color="white"
        />
        <Subheading style={styles.heading}>Users</Subheading>
      </View>
      <View style={styles.mainBox}>
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
    </View>
  );
};

export default memo(AttendanceSummary);

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    marginBottom: 5,
    padding: 10,
    elevation: 3,
    backgroundColor: COLORS.light,
    marginHorizontal: 2,
    borderRadius: 10,
  },
  mainBox: {
    flex: 1,
    flexDirection: 'row',
  },
  boxView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  heading: {
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  avatar: {
    backgroundColor: COLORS.primary,
  },
});
