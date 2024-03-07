import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {TextInput} from 'react-native-paper';
import LoadingView from '../../components/LoadingView';
import FlexRow from '../../components/settings/FlexRow';
import {COLORS} from '../../constants/theme/colors';
import useReport from '../../hooks/useReport';
import {useSelector} from 'react-redux';

const CumulativeReportScreen = () => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const {loading, data, fetchCumulativeReport} = useReport();

  const {token} = useSelector(state => state.auth);

  console.log(token);

  useEffect(() => {
    fetchCumulativeReport(date);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Pressable onPress={() => setOpen(true)}>
        <TextInput
          value={dayjs(date).format('DD MMMM YYYY')}
          editable={false}
          style={styles.input}
          label="Date"
        />
      </Pressable>
      <DatePicker
        date={date}
        modal
        open={open}
        mode="date"
        onCancel={() => setOpen(false)}
        onConfirm={date => {
          setOpen(false);
          fetchCumulativeReport(date);
          setDate(date);
        }}
      />

      <View style={styles.card}>
        <FlexRow
          backGroundColor={COLORS.primary}
          iconName="phone"
          label="Scheduled calls"
          value={data?.scheduled_call}
        />
        <FlexRow
          backGroundColor="#225ED6"
          iconName="phone-forward"
          label="Visited calls"
          value={data?.visited_call}
        />
        <FlexRow
          backGroundColor={COLORS.success}
          iconName="phone-check"
          label="Productive calls"
          value={data?.productive_call}
        />
        <FlexRow
          backGroundColor="#11BCCA"
          iconName="cube"
          label="Order count"
          value={data?.order_quantity}
        />
        <FlexRow
          backGroundColor="#24C6A4"
          iconName="cart"
          label="Order amount"
          value={data?.order_amount}
        />
        <FlexRow
          backGroundColor={COLORS.success}
          iconName="cash-register"
          label="Total amount (in INR)"
          value={data?.total_order}
        />
      </View>

      {loading && <LoadingView />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: COLORS.light,
  },
  card: {
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 2,
    elevation: 3,
    backgroundColor: COLORS.light,
    borderRadius: 10,
  },

  input: {
    marginVertical: 10,
    backgroundColor: COLORS.light,
  },
});

export default CumulativeReportScreen;
