import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, Alert} from 'react-native';
import {Col, Grid} from 'react-native-easy-grid';
import {Caption, DataTable, Divider, Text, Title} from 'react-native-paper';
import {IMAGE} from '../constants/images';
import {SPACINGS} from '../constants/theme';
import {topCustomerList} from '../services/performance_service';
import {COLORS} from '../constants/theme/colors';

const TopCustomerTable = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    getTopCustomer();
  }, []);

  const getTopCustomer = () => {
    const temp = {
      start_date: dayjs().subtract(7, 'days').format('YYYY-MM-DD'),
      end_date: dayjs().format('YYYY-MM-DD'),
      sort_by: 'amount',
      self: 1,
    };
    topCustomerList(temp)
      .then(res => {
        const {data, errors, success} = res.data;
        if (success) {
          setData(data.customers.slice(0, 5));
        } else {
            Alert.alert('Error', Object.values(errors).join(', '));
        }
      })
      .catch(e => {
        console.log('getTopCustomer', e);
      });
  };

  return (
    <View style={styles.card}>
      <Title style={{fontSize: 15, marginLeft: 5}}>
        Top 5 Customer (Last 7 Days)
      </Title>
      <Grid style={[styles.grid, {borderBottomWidth: 1, borderTopWidth: 1}]}>
        <Col style={styles.col}>
          <Caption>SAP Code</Caption>
        </Col>
        <Col style={styles.col} size={2}>
          <Caption style={styles.title}>Name</Caption>
        </Col>
        <Col style={styles.col}>
          <Caption style={styles.title}>Quantity</Caption>
        </Col>
        <Col style={styles.col}>
          <Caption style={styles.title}>Amount</Caption>
        </Col>
      </Grid>
      <Divider />
      {data && data.length > 0 ? (
        data.map(e => (
          <Grid key={e._id}>
            <Col style={styles.col}>
              <Text>{e.sap_code}</Text>
            </Col>
            <Col style={styles.col} size={2}>
              <Text textBreakStrategy="balanced">{e.name}</Text>
            </Col>
            <Col style={styles.col}>
              <Text textBreakStrategy="balanced">{e.quantity}</Text>
            </Col>
            <Col style={styles.col}>
              <Text>{e.amount}</Text>
            </Col>
          </Grid>
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Image source={IMAGE.emptyList} style={styles.emptyImg} />
          <Caption>Customer List for this date-range is empty.</Caption>
        </View>
      )}
    </View>
  );
};

export default TopCustomerTable;

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
    marginHorizontal: SPACINGS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyImg: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  grid: {
    flex: 1,
    marginVertical: SPACINGS.xxs,
  },

  col: {
    padding: SPACINGS.xxs,
  },
});
