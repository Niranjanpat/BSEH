import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Col, Grid} from 'react-native-easy-grid';
import {Title, Text, DataTable, Caption} from 'react-native-paper';
import {SPACINGS} from '../constants/theme';
import {COLORS} from '../constants/theme/colors';
import {URLS} from '../constants/urls';
import client from '../services/axios_client';

const RecentOrder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [recentOrder, setRecentOrder] = useState({});
  console.log(recentOrder);
  useEffect(() => {
    fetchLastTenVisits();
  }, []);

  const fetchLastTenVisits = async () => {
    setIsLoading(true);
    const url = URLS.latestOrder;
    try {
      const res = await client.get(url);
      const {data, errors, success} = res.data;
      console.log('ss', data);

      if (success) {
        setRecentOrder(data.orders);
      } else {
        console.log(errors);
      //  Alert.alert('Oops', JSON.stringify(errors));
      }
    } catch (error) {
      console.log('fetchLastTenVisits excp', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={{fontSize: 15, marginLeft: 5, alignSelf: 'center'}}>
        Recent Order
      </Title>
      <Grid style={[styles.grid, {borderBottomWidth: 1, borderTopWidth: 1}]}>
        <Col style={styles.col} size={2}>
          <Text>SAP Code</Text>
        </Col>
        <Col style={styles.col} size={2}>
          <Text>Name</Text>
        </Col>
        <Col style={styles.col}>
          <Text style={{textAlign: 'center'}}>Quantity</Text>
        </Col>
        <Col style={styles.col}>
          <Text style={{textAlign: 'center'}}>Amount</Text>
        </Col>
      </Grid>

      {recentOrder.length > 0 ? (
        recentOrder.map(item => (
          <Grid style={styles.grid}>
            <Col style={styles.col} size={2}>
              <Text>{item.customer_sap_code}</Text>
            </Col>
            <Col style={styles.col} size={2}>
              <Text>{item.customer_name}</Text>
            </Col>
            <Col style={styles.col}>
              <Text style={{textAlign: 'center'}}>{item.total_quantity}</Text>
            </Col>
            <Col style={styles.col}>
              <Text style={{textAlign: 'center'}}>
                {item.total_amount?.toFixed(2)}
              </Text>
            </Col>
          </Grid>
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Caption>No recent order available!</Caption>
        </View>
      )}
    </View>
  );
};

export default RecentOrder;

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACINGS.xs,
    backgroundColor: '#fff',
  },

  emptyContainer: {
    marginHorizontal: SPACINGS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  grid: {
    width: '100%',

    borderColor: COLORS.lightGrey,
    flex: 1,
  },

  col: {
    flex: 1,
    paddingHorizontal: 2,
    paddingVertical: 6,
  },
});
