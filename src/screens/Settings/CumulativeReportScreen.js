import React, {useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LoadingView from '../../components/LoadingView';
import FlexRow from '../../components/settings/FlexRow';
import {COLORS} from '../../constants/theme/colors';
import useReport from '../../hooks/useReport';
import {ROUTES} from '../../constants/routes';
import { Picker } from '@react-native-picker/picker';

const CumulativeReportScreen = ({navigation}) => {
  const {loading, data, fetchTodayCumulativeReport} = useReport();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const allMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearList = [];
    yearList.push((currentYear - 1));
    yearList.push(currentYear);
    
    setYears(yearList);
    calculateMonth();
    
  }, []);

  useEffect(() => {
    if (selectedYear === currentYear && selectedMonth > currentMonth) {
      return;
    }
    fetchTodayCumulativeReport(selectedYear, selectedMonth + 1);
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    calculateMonth();
  }, [selectedYear]);

  const calculateMonth = async () => {
    if (selectedYear === currentYear) {
      const month = [];
      try {
        allMonths.forEach((value, index) => {
          if (index < currentMonth) {
            month.push(value);
          } else {
            throw new Error("Break the loop.")
          }
        });
      } catch (error) {
      }
      setMonths(month);
    } else {
      setMonths(allMonths);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container_picker}>
      <View style={styles.picker}>
        <Picker
          selectedValue={selectedMonth}
          mode="dropdown"
          onValueChange={(value) => {setSelectedMonth(value);}}>
          <Picker.Item label="Select Month" value="" />
          {months.map((value, index) => (
            <Picker.Item
              key={index}
              label={value}
              value={index}
            />
          ))}
        </Picker>
      </View>
      <View style={styles.picker}>
        <Picker
          selectedValue={selectedYear}
          mode="dropdown"
          onValueChange={(value) => {setSelectedYear(value);}}>
          <Picker.Item label="Select Year" value="" />
          {years.map(value => (
            <Picker.Item
              key={value}
              label={value}
              value={value}
            />
          ))}
        </Picker>
      </View>
      </View>
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
          value={data?.total_order}
        />
        <FlexRow
          backGroundColor={COLORS.success}
          iconName="cash-register"
          label="Order Quantity"
          value={data?.order_quantity}
        />
        <FlexRow
          backGroundColor="#24C6A4"
          iconName="cart"
          label="Order amount"
          value={data?.order_amount}
        />
        {/* <FlexRow
          backGroundColor={COLORS.success}
          iconName="cash-register"
          label="Total amount (in INR)"
          value={data?.total_order}
        /> */}
      </View>
      <Pressable
        onPress={() => navigation.navigate(ROUTES.day_wise_cumulative)}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>View date wise report</Text>
          <Icon name="chevron-right-circle" size={23} color={COLORS.light} />
        </View>
      </Pressable>
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
  button: {
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 30,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
  },
  container_picker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  picker: {
    width: '49%',
    border: 1,
    backgroundColor: COLORS.lightGrey,
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default CumulativeReportScreen;
