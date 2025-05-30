import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {TextInput} from 'react-native-paper';
import dayjs from 'dayjs';
import DatePicker from 'react-native-date-picker';

const DateMonthSelector = ({onDateSelect}) => {
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);

  return (
    <View style={styles.dateContainer}>
      <TextInput
        label="Select Date"
        value={dayjs(date).format('YYYY MMM DD')}
        right={
          <TextInput.Icon
            onPress={() => {
              setShowDate(true);
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
        open={showDate}
        mode="date"
        date={date}
        maximumDate={new Date()}
        onConfirm={date => {
          setShowDate(false);
          setDate(date);
          onDateSelect(date);
        }}
        onCancel={() => {
          setShowDate(false);
        }}
      />
    </View>
  );
};

export default DateMonthSelector;

const styles = StyleSheet.create({
  dateContainer: {
    margin: 10,
  },
});
