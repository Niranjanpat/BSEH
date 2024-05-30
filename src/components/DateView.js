import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TextInput} from 'react-native-paper';
import dayjs from 'dayjs';
import DatePicker from 'react-native-date-picker';

const DateRangeView = ({onDateSelected}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);

  useEffect(() => {
    onDateSelected(
      dayjs(startDate).format('YYYY-MM-DD'),
      dayjs(endDate).format('YYYY-MM-DD'),
    );
  }, [startDate, endDate]);

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <TextInput
          label={'Start Date'}
          value={dayjs(startDate).format('YYYY-MM-DD')}
          right={
            <TextInput.Icon
              onPress={() => {
                setShowStartDate(true);
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
          open={showStartDate}
          mode="date"
          date={startDate}
          maximumDate={new Date()}
          onConfirm={date => {
            setShowStartDate(false);
            if (dayjs(date).isAfter(endDate)) {
              Alert.alert('Error', 'Start Date can not be after End Date.');
              return;
            }
            setStartDate(date);
          }}
          onCancel={() => {
            setShowStartDate(false);
          }}
        />
      </View>
      <View style={styles.dateContainer}>
        <TextInput
          label={'End Date'}
          value={dayjs(endDate).format('YYYY-MM-DD')}
          right={
            <TextInput.Icon
              onPress={() => {
                setShowEndDate(true);
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
          open={showEndDate}
          mode="date"
          date={endDate}
          maximumDate={new Date()}
          onConfirm={date => {
            setShowEndDate(false);
            if (dayjs(date).isBefore(startDate)) {
              Alert.alert('Error', 'End Date can not be before Start Date.');
              return;
            }
            setEndDate(date);
          }}
          onCancel={() => {
            setShowEndDate(false);
          }}
        />
      </View>
    </View>
  );
};

export default DateRangeView;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 5,
  },
  
  dateContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  inputText: {
    flex: 1,
    margin: 5,
  },
});
