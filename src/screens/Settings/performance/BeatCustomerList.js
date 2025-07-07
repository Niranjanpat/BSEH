import React from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import {Text as PaperText} from 'react-native-paper';

import {Col, Grid} from 'react-native-easy-grid';
import {COLORS} from '../../../constants/theme/colors';
import {customerListByBeatId} from '../../../services/performance_service';

const BeatCustomerList = ({route}) => {
  const routeId = route.params.routeId;
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCustomerListByBeatId();
  }, []);

  const fetchCustomerListByBeatId = async _ => {
    setIsLoading(true);
    try {
      const response = await customerListByBeatId(routeId);
      const {data, success, errors} = response.data;

      if (success) {
        setData(data.customers);
      } else if (errors) {
        Alert.alert(null, Object.values(errors).join(', '));
      }
    } catch (error) {
      console.log('fetchCustomerListByBeatId', error);
    }
    setIsLoading(false);
  };

  const renderCustomerList = e => {
    return (
      <>
        {
          <Grid key={e._id} style={styles.grid}>
            <Col style={styles.col}>
              <Text>{e.name}</Text>
            </Col>
            <Col style={styles.col}>
              <Text>{e.billing_address}</Text>
            </Col>
            <Col style={styles.col}>
              <Text>{e.customer_type}</Text>
            </Col>
            <Col style={styles.col}>
              <Text>{e.owner_contact_number}</Text>
            </Col>
            <Col style={styles.col}>
              <Text style={{textAlign: 'center'}}>
                {e.is_active ? '✔' : 'X'}
              </Text>
            </Col>
          </Grid>
        }
      </>
    );
  };

  return (
    <ScrollView>
      <Grid style={[styles.grid]}>
        <Col style={styles.col}>
          <PaperText>Name</PaperText>
        </Col>
        <Col style={styles.col}>
          <PaperText>Billing Address</PaperText>
        </Col>
        <Col style={styles.col}>
          <PaperText>Type</PaperText>
        </Col>
        <Col style={styles.col}>
          <PaperText>Contact</PaperText>
        </Col>
        <Col style={styles.col}>
          <PaperText style={{textAlign: 'center'}}>Active</PaperText>
        </Col>
      </Grid>
      {isLoading ? (
        <ActivityIndicator color={COLORS.accentPrimary} />
      ) : data.length == 0 ? (
        <Text style={{alignSelf: 'center'}}>Customer Unavailable !</Text>
      ) : (
        data.map(renderCustomerList)
      )}
    </ScrollView>
  );
};

export default BeatCustomerList;

const styles = StyleSheet.create({
  grid: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: COLORS.lightGrey,
    flex: 1,
  },

  col: {
    flex: 1,
    padding: 2,
  },
});
