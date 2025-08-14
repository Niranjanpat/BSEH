import {View, StyleSheet} from 'react-native';
import React from 'react';
import dayjs from 'dayjs';
import {Title, Text} from 'react-native-paper';
import { COLORS } from '../constants/theme/colors';

const CalendarItemList = ({item}) => {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.left,
          {
            backgroundColor:
              item?.status === 'present'
                ? COLORS.primary
                : COLORS.accentPrimary,
          },
        ]}>
        <Title style={styles.title}>{dayjs(item?.date).format('DD MMM')}</Title>
      </View>
      <View style={styles.right}>
        <Text style={styles.text}>
          Time: {item?.punch_in_time ? item?.punch_in_time : 'N/A'} -{' '}
          {item?.punch_out_time ? item?.punch_out_time : 'N/A'}
        </Text>
        <Text style={styles.text}>
          Status: {item?.status ? item?.status : 'N/A'}
        </Text>
        <Text style={styles.text}>
          Reason:{' '}
          {item?.absent_reason_text
            ? item?.absent_reason_text
            : item?.present_reason_text
            ? item?.present_reason_text
            : 'N/A'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    flexDirection: 'row',
    elevation: 2,
    backgroundColor: '#FCFCFB',
  },
  left: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  right: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  title: {
    color: COLORS.light,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
});

export default CalendarItemList;
