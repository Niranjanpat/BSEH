import {Picker} from '@react-native-picker/picker';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Button, TextInput} from 'react-native-paper';
import {COLORS} from '../../../constants/theme/colors';
import useDistributorSchedule from '../../../hooks/useDistributorSchedule';

const UpdateDistributorScheduleScreen = ({route}) => {
  const {item} = route.params;
  const scheduleDate=item.date;
  const scheduleRemarks=item.remarks;
  const id=item.distributor_id;

  const [date, setDate] = useState(new Date(scheduleDate));
  const [remarks, setRemarks] = useState(scheduleRemarks);
  const [open, setOpen] = useState(false);

  const {loading,  editDistributorSchedule} = useDistributorSchedule();


  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => setOpen(true)}>
          <TextInput
            value={dayjs(date).format('DD MMMM YYYY')}
            editable={false}
            style={styles.input}
            label="Date"
          />
        </Pressable>
        <DatePicker
          minimumDate={new Date()}
          date={date}
          modal
          open={open}
          mode="date"
          onCancel={() => setOpen(false)}
          onConfirm={date => {
            setOpen(false);
            setDate(date);
          }}
        />
        <TextInput
          value={remarks}
          onChangeText={setRemarks}
          multiline
          numberOfLines={3}
          style={styles.input}
          label="Remarks"
        />
        <Button
          mode="contained"
          style={styles.btn}
          loading={loading}
          disabled={loading}
          onPress={() =>
            editDistributorSchedule(
              {
                date: dayjs(date).format('YYYY-MM-DD'),
                remarks,
                assignee: (item.assignee || 'subordinates'),
                _method: 'PUT',
              },
              id,
            )
          }>
          Update
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  root: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  input: {
    marginVertical: 10,
    backgroundColor: 'transparent',
  },
  btn: {
    marginVertical: 20,
  },
});

export default UpdateDistributorScheduleScreen;
