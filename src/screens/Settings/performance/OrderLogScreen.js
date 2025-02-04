import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, View, Dimensions} from 'react-native';
import {Caption, Text, ToggleButton, TextInput} from 'react-native-paper';
import {IMAGE} from '../../../constants/images';
import {SPACINGS} from '../../../constants/theme';
import {weeklyOrderLog} from '../../../services/performance_service';
import {Col, Grid} from 'react-native-easy-grid';
import {COLORS} from '../../../constants/theme/colors';
import DateMonthModal from '../../../components/DateMonthModal';
import DatePicker from 'react-native-date-picker';

const OrderLogScreen = ({route}) => {
  const [data, setData] = useState([]);
  const [dataDSM, setDataDSM] = useState([]);
  const [value, setValue] = useState('0');
  const {role} = route.params;

  const [modalOpen, setModalOpen] = useState(false);
  const [date, setDate] = useState(new Date());

  const [endDate, setEndDate] = useState(
    dayjs(new Date()).add(6, 'days').format('YYYY-MM-DD'),
  );
  const [startDate, setStartDate] = useState(
    dayjs(new Date()).format('YYYY-MM-DD'),
  );

  const [month, setMonth] = useState(dayjs().format('M'));
  const [year, setYear] = useState(dayjs().format('YYYY'));

  useEffect(() => {
    getTopCustomerDSM();
    //getTopCustomer();
  }, [date]);
  console.log(data);
  const getTopCustomerDSM = () => {
    const temp = {
      id: route.params?.id,
      start_date: startDate,
      end_date: endDate,
      sort_by: 'amount',
      page: 1,
      self: 1,
    };
    weeklyOrderLog(temp)
      .then(res => {
        console.log('order log', res);

        const {data, errors, success} = res.data;
        console.log(data);
        if (success) {
          setDataDSM(data.days);
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
      start_date: dayjs(startDate).format('YYYY-MM-DD'),
      end_date: dayjs(endDate).format('YYYY-MM-DD'),
      sort_by: 'amount',
      page: 1,
      self: 0,
    };
    weeklyOrderLog(temp)
      .then(res => {
        const {data, errors, success} = res.data;
        console.log('orders', res);
        if (success) {
          setData(data.days);
        } else {
          console.log('order', res);
          alert(JSON.stringify(errors));
        }
      })
      .catch(e => {
        alert(JSON.stringify(e));
      });
  };

  const changeDates = d => {
    setStartDate(dayjs(d).format('YYYY-MM') + '-01');
    setEndDate(
      dayjs(d).format('YYYY-MM') +
        '-' +
        new Date(dayjs(d).format('YYYY'), dayjs(d).format('MM'), 0).getDate(),
    );

    setDate(d);
  };

  return (
    <ScrollView>
      <TextInput
        label="Start Date"
        value={dayjs(startDate).format('YYYY-MM-DD')}
        right={
          <TextInput.Icon
            onPress={() => {
              setModalOpen(true);
            }}
            icon="calendar-outline"
          />
        }
        style={styles.inputText}
        editable={false}
        mode="outlined"
      />
      <DatePicker
        modal
        mode="date"
        open={modalOpen}
        date={new Date()}
        onConfirm={date => {
          setModalOpen(false);
          setStartDate(dayjs(date).format('YYYY-MM-DD'));
          setEndDate(dayjs(date).add(6, 'days').format('YYYY-MM-DD'));
          setDate(date);
        }}
        onCancel={() => setModalOpen(false)}
      />
      {/* <DateMonthModal
        dates={date}
        open={modalOpen}
        onModalPress={() => setModalOpen(true)}
        onDismiss={() => setModalOpen(false)}
        onDateChange={date => changeDates(date)}
      /> */}
      {role === 'dsm' && (
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
              <Grid style={[styles.grid,{color:'black'}]} key={e._id}>
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
              <Grid style={[styles.grid,{color:'black'}]} key={e._id}>
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
