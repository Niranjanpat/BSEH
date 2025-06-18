import dayjs from 'dayjs';
import React, {useCallback, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import DayPlanInformation from '../../../components/performance/DayPlanInformation';
import ValueInformation from '../../../components/performance/ValueInformation';
import WorkDetail from '../../../components/performance/WorkDetail';
import {COLORS} from '../../../constants/theme/colors';
import MTDPerformance from '../../../components/performance/MTDPerformance';
import MTDThroughput from '../../../components/performance/MTDThroughput';
import usePerformance from '../../../hooks/usePerformance';
import {useFocusEffect} from '@react-navigation/native';
import LoadingView from '../../../components/LoadingView';
import DateTimePicker from '@react-native-community/datetimepicker';

const MTDPerformanceScreen = ({route}) => {
  const {id} = route.params;

  const [startDate, setStartDate] = useState(
    new Date(dayjs().startOf('month')),
  );
  const [endDate, setEndDate] = useState(new Date());
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const {data, loading, fetchMtdPerformanceData} = usePerformance();

  useFocusEffect(
    useCallback(() => {
      fetchMtdPerformanceData([id], startDate, endDate);
    }, [startDate, endDate]),
  );

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
      <ScrollView showsVerticalScrollIndicator={false}>
        <DayPlanInformation data={data} />
        <WorkDetail data={data} />
        <MTDPerformance data={data} />
        <MTDThroughput data={data} />
        <ValueInformation data={data} />
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
});

export default MTDPerformanceScreen;
