import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, View, Dimensions} from 'react-native';
import {Caption, Text, ToggleButton, TextInput} from 'react-native-paper';
import {IMAGE} from '../../../constants/images';
import {SPACINGS} from '../../../constants/theme';
import {weeklyOrderLog} from '../../../services/performance_service';
import {Col, Grid} from 'react-native-easy-grid';
import {COLORS} from '../../../constants/theme/colors';

import DatePicker from 'react-native-date-picker';

const OrderLogScreen = ({route}) => {
  const [data, setData] = useState([]);
  const [dataDSM, setDataDSM] = useState([]);
  const [value, setValue] = useState('0');
  const {role} = route.params;

  const [modalOpen, setModalOpen] = useState(false);
  const [date, setDate] = useState(new Date());

  const [month, setMonth] = useState(dayjs().format('M'));
  const [year, setYear] = useState(dayjs().format('YYYY'));

  const d = new Date();

  const [startDate, setStartDate] = useState(
    dayjs(d).subtract(6).format('YYYY-MM-DD'),
  );
  const [endDate, setEndDate] = useState(dayjs(d).format('YYYY-MM-DD'));

  useEffect(() => {
    getTopCustomerDSM();
    getTopCustomer();
  }, [date]);
  console.log(data);
  const getTopCustomerDSM = () => {
    const temp = {
      id: route.params?.id,
      // year: year,
      // month: month,
      sort_by: 'amount',
      page: 1,
      self: 1,
      start_date: startDate,
      end_date: endDate,
    };

    console.log('temp', temp);

    weeklyOrderLog(temp)
      .then(res => {
        const {data, errors, success} = res.data;
        
        if (success) {
          setDataDSM(data.days);
        } else if (errors) {
          alert(Object.values(errors).join(', '));
        }
      })
      .catch(e => {
        alert(JSON.stringify(e));
      });
  };
  const getTopCustomer = () => {
    const temp = {
      id: route.params?.id,

      sort_by: 'amount',
      page: 1,
      self: 0,
      start_date: startDate,
      end_date: endDate,
    };
    weeklyOrderLog(temp)
      .then(res => {
        const {data, errors, success} = res.data;
        if (success) {
          setData(data.days);
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
      {/* <DateMonthModal
        dates={date}
        open={modalOpen}
        onModalPress={() => setModalOpen(true)}
        onDismiss={() => setModalOpen(false)}
        onDateChange={date => changeDates(date)}
      /> */}

      <View style={{flexDirection: 'row'}}>
        <TextInput
          style={styles.inputText}
          editable={false}
          value={endDate}
          label="Select date"
          mode="outlined"
          right={
            <TextInput.Icon
              onPress={() => setModalOpen(true)}
              icon="calendar-outline"
            />
          }
        />
      </View>

      <DatePicker
        modal
        mode="date"
        open={modalOpen}
        date={new Date()}
        onConfirm={date => {
          setModalOpen(false);
          setEndDate(dayjs(date).format('YYYY-MM-DD'));
          setStartDate(dayjs(date).subtract(6).format('YYYY-MM-DD'));
        }}
        onCancel={() => {
          setModalOpen(false);
        }}
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
            <Caption style={styles.title}>Date</Caption>
          </Col>

          <Col style={styles.col}>
            <Caption style={styles.title}>Quantity</Caption>
          </Col>
          <Col style={styles.col} size={2}>
            <Caption style={styles.title}>Amount</Caption>
          </Col>
        </Grid>
      </ScrollView>
      {value === '0' ? (
        <>
          {data && data.length > 0 ? (
            data.map(e => (
              <Grid style={styles.grid} key={e._id}>
                <Col style={styles.col} size={2}>
                  <Text>{e.date}</Text>
                </Col>
                <Col style={styles.col} size={2}>
                  <Text>{e.quantity}</Text>
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
        </>
      ) : (
        <>
          {dataDSM && dataDSM.length > 0 ? (
            dataDSM.map(e => (
              <Grid style={styles.grid} key={e._id}>
                <Col style={styles.col} size={2}>
                  <Text>{e.date}</Text>
                </Col>
                <Col style={styles.col}>
                  <Text>{e.quantity}</Text>
                </Col>
                <Col style={styles.col}>
                  <Text>{e.amount}</Text>
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

export default OrderLogScreen;

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
  inputText: {width: '45%', margin: 5, flex: 1,},

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
