import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import dayjs from 'dayjs';
import {TextInput} from 'react-native-paper';
import MonthPicker from 'react-native-month-year-picker';
import {useCallback} from 'react';

const DateMonthModal = ({
  open,
  onModalPress,
  onDismiss,
  dates,
  onDateChange,
}) => {
  const [date, setDate] = useState(new Date());

  const onValueChange = (event, date) => {
    if (date) {
      const selectedDate = date;
      onDismiss();
      setDate(selectedDate);
      onDateChange(selectedDate);
    } else {
      onDismiss();
    }
  };

  return (
    <View>
      <TextInput
        style={{flex:1,margin:10}}
        editable={false}
        value={dayjs(dates).format('MMMM YYYY')}
        label="Select datetime"
        mode="outlined"
        right={
          <TextInput.Icon onPress={onModalPress} icon="calendar-outline" />
        }
      />

      {/* <Datepicker
        modal
        mode="date"
        open={open}
        date={dates}
        onConfirm={date => {
          onDismiss();
          onDateChange(date);
        }}
        onCancel={() => onDismiss()}
      /> */}

      {open && (
        <MonthPicker
          value={dates ? dates : date}
          okButton="Confirm"
          onChange={onValueChange}
          cancelButton="Cancel"
          mode="full"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputText: {width: '45%', margin: 15},
});

export default DateMonthModal;
