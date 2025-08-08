import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {ScrollView, View, StyleSheet, Image} from 'react-native';
import {Caption, Divider, Text, ToggleButton} from 'react-native-paper';
import {Col, Grid} from 'react-native-easy-grid';

import {IMAGE} from '../../../constants/images';
import {SPACINGS} from '../../../constants/theme';
import {topCustomerList} from '../../../services/performance_service';
import DateMonthModal from '../../../components/DateMonthModal';

const TopCustomersScreen = ({route}) => {
  const [data, setData] = useState([]);
  const [dataDSM, setDataDSM] = useState([]);
  const [value, setValue] = useState('0');
  const {role} = route.params;

  const [modalOpen, setModalOpen] = useState(false);
  const [date, setDate] = useState(new Date());

  const [month, setMonth] = useState(dayjs().format('M'));
  const [year, setYear] = useState(dayjs().format('YYYY'));

  useEffect(() => {
    getTopCustomerDSM();
    getTopCustomer();
  }, [date]);

  const getTopCustomerDSM = () => {
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0]; 
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]; 
    const temp = {
      id: route.params?.id,
      start_date: startDate,
      end_date: endDate,
      sort_by: 'amount',
      self: 1,
    };
    topCustomerList(temp)
      .then(res => {
        const {data, errors, success} = res.data;
        if (success) {
          setDataDSM(data.customers);
        } else if (errors) {
          alert(Object.values(errors).join(', '));
        }
      })
      .catch(e => {
        alert(JSON.stringify(e));
      });
  };
  const getTopCustomer = () => {
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0]; 
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]; 
    const temp = {
      id: route.params?.id,
      start_date: startDate,
      end_date: endDate,
      sort_by: 'amount',
      self: 0,
    };
    topCustomerList(temp)
      .then(res => {
        const {data, errors, success} = res.data;
        console.log(data);
        if (success) {
          setData(data.customers);
        } else if (errors) {
          alert(Object.values(errors).join(', '));
        }
      })
      .catch(e => {
        alert(JSON.stringify(e));
      });
  };

  const changeDates = d => {
    setYear(dayjs(d).format('YYYY'));
    setMonth(dayjs(d).format('M'));
    setDate(d);
  };

  return (
    <ScrollView>
      <DateMonthModal
        dates={date}
        open={modalOpen}
        onModalPress={() => setModalOpen(true)}
        onDismiss={() => setModalOpen(false)}
        onDateChange={date => changeDates(date)}
      />
      {role === 'sales-officer' && (
        <ToggleButton.Row
          style={{alignSelf: 'center', marginHorizontal: 10}}
          onValueChange={value => setValue(value)}
          value={value}>
          <ToggleButton
            accessibilityLabel="ssss"
            icon="account-outline"
            value="0"
          />
          <ToggleButton
            accessibilityLabel="ssss"
            icon="account-multiple-outline"
            value="1"
          />
        </ToggleButton.Row>
      )}
      <Grid style={styles.grid}>
        <Col style={styles.col} size={1.5}>
          <Caption>SAP</Caption>
        </Col>
        <Col style={styles.col} size={1.5}>
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

      {value === '0' ? (
        <>
          {data && data.length > 0 ? (
            data?.map(e => (
              <View key={e._id}>
                <Grid style={styles.grid}>
                  <Col style={styles.col} size={1.5}>
                    <Text>{e.sap_code}</Text>
                  </Col>
                  <Col style={styles.col} size={1.5}>
                    <Text style={styles.title}>{e.name}</Text>
                  </Col>
                  <Col style={styles.col}>
                    <Text style={styles.title}>{e.quantity}</Text>
                  </Col>
                  <Col style={styles.col}>
                    <Text style={styles.title}>{e.amount}</Text>
                  </Col>
                </Grid>
                <Divider />
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Image source={IMAGE.emptyList} style={styles.emptyImg} />
              <Caption>Customer List for this date-range is empty.</Caption>
            </View>
          )}
        </>
      ) : (
        <>
          {dataDSM && dataDSM.length > 0 ? (
            dataDSM.map(e => (
              <View key={e._id}>
                <Grid style={styles.grid}>
                  <Col style={styles.col} size={1.5}>
                    <Text>{e.sap_code}</Text>
                  </Col>
                  <Col style={styles.col} size={1.5}>
                    <Text style={styles.title}>{e.name}</Text>
                  </Col>
                  <Col style={styles.col}>
                    <Text style={styles.title}>{e.quantity}</Text>
                  </Col>
                  <Col style={styles.col}>
                    <Text style={styles.title}>{e.amount}</Text>
                  </Col>
                </Grid>
                <Divider />
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Image source={IMAGE.emptyList} style={styles.emptyImg} />
              <Caption>Customers List for this date-range is empty.</Caption>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

export default TopCustomersScreen;

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },

  inputText: {width: '45%', margin: 5},

  grid: {
    flex: 1,
    marginVertical: SPACINGS.xxs,
  },

  col: {
    padding: SPACINGS.xxs,
  },

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
