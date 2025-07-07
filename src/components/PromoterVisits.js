import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {Text, Title} from 'react-native-paper';

import {COLORS} from '../constants/theme/colors';
import {SPACINGS} from '../constants/theme';
import {Col, Grid} from 'react-native-easy-grid';
import {useState} from 'react';
import {URLS} from '../constants/urls';
import dayjs from 'dayjs';
import client from '../services/axios_client';

const PromoterVisitList = () => {
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    const url = URLS.customerVisits + '/' + dayjs().format('YYYY-MM-DD');

    try {
      const res = await client.get(url);
      const {data, errors, success} = res.data;

      if (success) {
        console.log(data);
        setVisits(data.customer_visits);
      } else if (errors) {
        Alert.alert('Oops', Object.values(errors).join(', '));
      }
    } catch (error) {
      console.log('fetchVisits excp', error);
    }
  };
  return (
    <>
      {visits.length > 0 ? (
        <>
          <Title style={{fontSize: 15, marginLeft: 5}}>Recent Visits</Title>
          <Grid style={styles.grid}>
            <Col style={styles.col} size={2}>
              <Text>SAP Code</Text>
            </Col>
            <Col style={styles.col} size={2}>
              <Text>Name</Text>
            </Col>
            <Col style={styles.col}>
              <Text style={{textAlign: 'center'}}>Check in</Text>
            </Col>
            <Col style={styles.col}>
              <Text style={{textAlign: 'center'}}>Check out</Text>
            </Col>
          </Grid>
          <ScrollView style={styles.container}>
            {visits.map(item => {
              return (
                <Grid key={item._id} style={styles.grid}>
                  <Col style={styles.col} size={2}>
                    <Text>
                      {item.customer_sap_code ? item.customer_sap_code : 'N/A'}
                    </Text>
                  </Col>
                  <Col style={styles.col} size={2}>
                    <Text>{item.customer}</Text>
                  </Col>
                  <Col style={styles.col}>
                    <Text style={{textAlign: 'center'}}>
                      {item.check_in_time}
                    </Text>
                  </Col>
                  <Col style={styles.col}>
                    <Text style={{textAlign: 'center'}}>
                      {item.check_out_time ? item.check_out_time : '-'}
                    </Text>
                  </Col>
                </Grid>
              );
            })}
          </ScrollView>
        </>
      ) : null}
    </>
  );
};

export default PromoterVisitList;

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACINGS.xs,
    maxHeight: 180,
  },

  emptyContainer: {
    marginHorizontal: SPACINGS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  grid: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: COLORS.lightGrey,
    flex: 1,
  },

  col: {
    flex: 1,
    paddingHorizontal: 2,
    paddingVertical: 6,
  },
});
