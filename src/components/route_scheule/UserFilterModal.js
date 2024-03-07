import dayjs from 'dayjs';
import React, {memo, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Button, Dialog, Portal, TextInput} from 'react-native-paper';
import {COLORS} from '../../constants/theme/colors';
import {Picker} from '@react-native-picker/picker';

const UserFilterModal = ({
  visible,
  onOkClick,
  startDate,
  endDate,
  status,
  onStartDateChange,
  onEndDateChange,
  onStatusChange,
}) => {
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  return (
    <Portal>
      <Dialog
        visible={visible}
        dismissable={false}
        style={styles.container}
        theme={{roundness: 3}}>
        <Dialog.Title>Filter</Dialog.Title>
        <Dialog.Content>
          <Pressable onPress={() => setStartDateOpen(true)}>
            <TextInput
              value={dayjs(startDate).format('DD MMMM YYYY')}
              editable={false}
              label="Start date"
              style={styles.input}
            />
          </Pressable>
          <DatePicker
            mode="date"
            date={startDate}
            modal
            open={startDateOpen}
            onCancel={() => setStartDateOpen(false)}
            onConfirm={date => {
              setStartDateOpen(false);
              onStartDateChange(date);
            }}
          />
          <Pressable onPress={() => setEndDateOpen(true)}>
            <TextInput
              mode="date"
              value={dayjs(endDate).format('DD MMMM YYYY')}
              editable={false}
              label="End date"
              style={styles.input}
            />
          </Pressable>

          <DatePicker
            date={endDate}
            modal
            open={endDateOpen}
            onCancel={() => setEndDateOpen(false)}
            onConfirm={date => {
              setEndDateOpen(false);
              onEndDateChange(date);
            }}
          />
          <View style={styles.picker}>
            <Picker selectedValue={status} onValueChange={onStatusChange}>
              <Picker.Item value="" label="All" />
              <Picker.Item value="approved" label="Approved" />
              <Picker.Item value="rejected" label="Rejected" />
              <Picker.Item value="pending" label="Pending" />
            </Picker>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onOkClick}>Ok</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.light,
  },
  input: {
    marginVertical: 10,
    backgroundColor: 'transparent',
  },
  picker: {
    marginVertical: 10,
    elevation: 3,
    backgroundColor: COLORS.light,
    borderRadius: 10,
  },
});

export default memo(UserFilterModal);
