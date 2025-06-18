import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, View, Dimensions} from 'react-native';
import {Caption, Text, ToggleButton} from 'react-native-paper';
import {IMAGE} from '../../../constants/images';
import {SPACINGS} from '../../../constants/theme';
import {customerOrderList} from '../../../services/performance_service';
import {Col, Grid} from 'react-native-easy-grid';
import {COLORS} from '../../../constants/theme/colors';
import DateMonthModal from '../../../components/DateMonthModal';

const CustomerOrderScreen = ({route}) => {
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
  console.log(data);
  const getTopCustomerDSM = () => {
    const temp = {
      id: route.params?.id,
      year: year,
      month: month,
      sort_by: 'amount',
      page: 1,
      self: 1,
    };
    customerOrderList(temp)
      .then(res => {
        const {data, errors, success} = res.data;
        console.log(data);
        if (success) {
          setDataDSM(data.customers);
        } else {
          alert(JSON.stringify(errors));
        }
      })
      .catch(e => {
        alert(JSON.stringify(e));
      });
  };
  const getTopCustomer = () => {
    const temp = {
      id: route.params?.id,
      year: year,
      month: month,
      sort_by: 'amount',
      page: 1,
      self: 0,
    };
    customerOrderList(temp)
      .then(res => {
        const {data, errors, success} = res.data;
        console.log(res);
        console.log(data);
        if (success) {
          setData(data.customers);
        } else {
          alert(JSON.stringify(errors));
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

      <ScrollView
        horizontal
        style={{width: '100%'}}
        contentContainerStyle={{flex: 1}}
        showsHorizontalScrollIndicator={false}>
        <Grid style={styles.grid}>
          <Col style={styles.col} size={2}>
            <Caption style={styles.title}>SAP Code</Caption>
          </Col>
          <Col style={styles.col} size={2}>
            <Caption style={styles.title}>Name</Caption>
          </Col>
          <Col style={styles.col}>
            <Caption style={styles.title}>Order</Caption>
          </Col>
          <Col style={styles.col}>
            <Caption style={styles.title}>Line Items</Caption>
          </Col>
          <Col style={styles.col}>
            <Caption style={styles.title}>Quantity</Caption>
          </Col>
          <Col style={styles.col} size={2}>
            <Caption style={styles.title}>Amount</Caption>
          </Col>
          <Col style={[styles.col, {alignItems: 'center'}]}>
            <Caption style={styles.title}>LPC</Caption>
          </Col>
        </Grid>
      </ScrollView>
      {value === '0' ? (
        <>
          {data && data.length > 0 ? (
            data.map(e => (
              <Grid style={styles.grid}>
                <Col style={styles.col} size={2}>
                  <Text>{e.sap_code}</Text>
                </Col>
                <Col style={styles.col} size={2}>
                  <Text>{e.name}</Text>
                </Col>
                <Col style={styles.col}>
                  <Text>{e.total_orders}</Text>
                </Col>
                <Col style={styles.col}>
                  <Text>{e.total_products}</Text>
                </Col>
                <Col style={styles.col}>
                  <Text> {e.total_quantity}</Text>
                </Col>
                <Col style={styles.col} size={2}>
                  <Text>{e.total_amount}</Text>
                </Col>
                <Col style={[styles.col, {alignItems: 'center'}]}>
                  <Text>{e.lpc}</Text>
                </Col>
              </Grid>
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
              <Grid style={styles.grid}>
                <Col style={styles.col} size={2}>
                  <Text>{e.sap_code}</Text>
                </Col>
                <Col style={styles.col} size={2}>
                  <Text>{e.name}</Text>
                </Col>
                <Col style={styles.col}>
                  <Text>{e.total_orders}</Text>
                </Col>
                <Col style={styles.col}>
                  <Text>{e.total_products}</Text>
                </Col>
                <Col style={styles.col}>
                  <Text> {e.total_quantity}</Text>
                </Col>
                <Col style={styles.col} size={2}>
                  <Text>{e.total_amount}</Text>
                </Col>
                <Col style={[styles.col, {alignItems: 'flex-end'}]}>
                  <Text>{e.lpc}</Text>
                </Col>
              </Grid>
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

export default CustomerOrderScreen;

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  title: {
    fontWeight: '700',
    fontSize: 11,
  },
  col: {
    flex: 1,
    padding: 2,
  },
  grid: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: COLORS.lightGrey,
    flex: 1,
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
