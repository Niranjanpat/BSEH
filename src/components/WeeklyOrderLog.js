import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {View, Alert, StyleSheet, Image} from 'react-native';
import {Caption, DataTable, Title} from 'react-native-paper';
import {IMAGE} from '../constants/images';
import {SPACINGS} from '../constants/theme';
import {weeklyOrderLog} from '../services/performance_service';
import { COLORS } from '../constants/theme/colors';

const WeekOrderLog = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getWeelklyOrderLog();
  }, []);

  const getWeelklyOrderLog = () => {
    const temp = {
      start_date: dayjs().subtract(6, 'days').format('YYYY-MM-DD'),
      end_date: dayjs().format('YYYY-MM-DD'),
      self: 1,
    };
    weeklyOrderLog(temp)
      .then(res => {
        const {data, errors, success} = res.data;
        if (success) {
          setData(data.days);
        } else if (errors) {
          Alert.alert('Error orders', Object.values(errors).join(', '));
        }
      })
      .catch(e => {
        console.log('getWeelklyOrderLog', e);
      });
  };

  return (
    <View style={styles.card}>
      <Title style={{fontSize: 15, marginLeft: 5}}>
        Order Log (Last 7 Days)
      </Title>
      <DataTable>
        <DataTable.Header style={{borderBottomWidth: 3, borderTopWidth: 1}}>
          <DataTable.Title>Date</DataTable.Title>
          <DataTable.Title numeric>Quantity</DataTable.Title>
          <DataTable.Title numeric>Amount</DataTable.Title>
        </DataTable.Header>
        {data && data.length > 0 ? (
          data.map(e => (
            <DataTable.Row key={e._id}>
              <DataTable.Cell>{e.date}</DataTable.Cell>
              <DataTable.Cell numeric>{e.quantity}</DataTable.Cell>
              <DataTable.Cell numeric>{e.amount}</DataTable.Cell>
            </DataTable.Row>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Image source={IMAGE.emptyList} style={styles.emptyImg} />
            <Caption>No order log available for last week.</Caption>
          </View>
        )}
      </DataTable>
    </View>
  );
};

export default WeekOrderLog;

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    padding: 10,
    elevation: 3,
    backgroundColor: COLORS.light,
    marginHorizontal: 2,
    borderRadius: 10,
  },

  inputText: {width: '45%', margin: 5},

  emptyContainer: {
    marginTop: SPACINGS.lg,
    marginHorizontal: SPACINGS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyImg: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});
