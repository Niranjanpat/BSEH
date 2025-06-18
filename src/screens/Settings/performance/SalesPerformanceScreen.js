import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import {Caption, Divider, Text, TextInput} from 'react-native-paper';
import {COLORS} from '../../../constants/theme/colors';
import usePerformance from '../../../hooks/usePerformance';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SalesItemList from '../../../components/performance/SalesItemList';

const SalesPerformanceScreen = ({route}) => {
  const {id} = route.params;

  const [startDate, setStartDate] = useState(
    new Date(dayjs().startOf('month')),
  );
  const [endDate, setEndDate] = useState(new Date());
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const {products, loading, fetchSalesProducts} = usePerformance();

  useEffect(() => {
    const ids = [];
    if (id && typeof id === 'string') {
      ids.push(id);
    } else {
      ids.concat(id);
    }
    fetchSalesProducts(ids, startDate, endDate);
  }, [startDate, endDate]);

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Pressable
          style={styles.inputContainer}
          onPress={() => setStartDateOpen(true)}>
          <TextInput
            label="Start date"
            value={dayjs(startDate).format('YYYY/MM/DD')}
            style={styles.input}
            editable={false}
          />
        </Pressable>
        <Pressable
          style={styles.inputContainer}
          onPress={() => setEndDateOpen(true)}>
          <TextInput
            label="End date"
            value={dayjs(endDate).format('YYYY/MM/DD')}
            style={styles.input}
            editable={false}
          />
        </Pressable>
      </View>
      {startDateOpen && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="calendar"
          maximumDate={new Date()}
          onChange={(_, date) => {
            setStartDateOpen(false);
            setStartDate(date);

            if (dayjs(date).isAfter(endDate)) {
              setEndDate(date);
            }
          }}
        />
      )}
      {endDateOpen && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="calendar"
          maximumDate={new Date()}
          onChange={(_, date) => {
            setEndDateOpen(false);
            setEndDate(date);

            if (dayjs(date).isBefore(startDate)) {
              setStartDate(date);
            }
          }}
        />
      )}
      <Divider />
      <Divider />
      <Divider />
      <Divider />
      <View style={styles.row}>
        <View style={styles.left}>
          <Text>Product</Text>
          <Caption>SAP code</Caption>
        </View>
        <View style={styles.mid}>
          <Text>Quantity</Text>
        </View>
        <View style={styles.right}>
          <Text>Amount (In INR)</Text>
        </View>
      </View>
      <Divider />
      <Divider />
      <Divider />
      <Divider />
      <FlatList
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<></>}
        data={products}
        refreshing={loading}
        onRefresh={() => fetchSalesProducts(id ? [id] : [], startDate, endDate)}
        renderItem={({item}) => <SalesItemList item={item} />}
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Icon size={100} name="point-of-sale" />
            <Text style={styles.emptyViewText}>
              No data found for this date range
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: COLORS.light,
  },
  top: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  inputContainer: {
    width: '40%',
  },
  input: {
    backgroundColor: COLORS.light,
  },
  row: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  left: {
    flex: 5,
    justifyContent: 'center',
  },
  mid: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  emptyView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  emptyViewText: {
    marginTop: 10,
    textAlign: 'center',
  },
  text: {
    fontSize: 12,
    textAlign: 'auto',
  },
});

export default SalesPerformanceScreen;
