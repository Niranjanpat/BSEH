import dayjs from 'dayjs';
import React, {useCallback, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {Text, TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AttendanceInformation from '../../../components/performance/AttendanceInformation';
import OfficialInformation from '../../../components/performance/OfficialInformation';
import OrderInformation from '../../../components/performance/OrderInformation';
import ValueInformation from '../../../components/performance/ValueInformation';
import {ROUTES} from '../../../constants/routes';
import {COLORS} from '../../../constants/theme/colors';
//import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-date-picker';
import usePerformance from '../../../hooks/usePerformance';
import LoadingView from '../../../components/LoadingView';
import {useFocusEffect} from '@react-navigation/native';

const IndividualPerformanceScreen = ({navigation, route}) => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const {id} = route.params;

  const {loading, data, fetchUserDailyPerformance} = usePerformance();

  useFocusEffect(
    useCallback(() => {
      fetchUserDailyPerformance(id ?? null, date);
    }, [date]),
  );

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setOpen(true)}>
        <TextInput
          label="Date"
          style={styles.input}
          value={dayjs(date).format('YYYY/MM/DD')}
          editable={false}
        />
      </Pressable>
      {open && (
        <DatePicker
          value={date}
          mode="date"
          display="calendar"
          maximumDate={new Date()}
          onChange={(_, date) => {
            setOpen(false);
            setDate(date);
          }}
        />
      )}
      <ScrollView showsVerticalScrollIndicator={false}>
        <OfficialInformation data={data} />
        <AttendanceInformation data={data} />
        <OrderInformation data={data} />
        <ValueInformation data={data} />
        <Pressable
          onPress={() => navigation.navigate(ROUTES.mtd_performance, {id: id})}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>See MTD Performance</Text>
            <Icon name="chevron-right-circle" size={23} color={COLORS.light} />
          </View>
        </Pressable>
      </ScrollView>
      {loading && <LoadingView />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: COLORS.light,
  },
  input: {
    marginVertical: 10,
    backgroundColor: COLORS.light,
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
});

export default IndividualPerformanceScreen;
