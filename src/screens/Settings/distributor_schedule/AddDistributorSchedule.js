import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Button, TextInput} from 'react-native-paper';
import {COLORS} from '../../../constants/theme/colors';
import useDistributorSchedule from '../../../hooks/useDistributorSchedule';

const AddRouteScheduleScreen = ({route}) => {
  const {id,assignee}=route.params;
  const [date, setDate] = useState(new Date());
  const [remarks, setRemarks] = useState('');
  const [open, setOpen] = useState(false);
  const {loading, postDistributorSchedule} = useDistributorSchedule();

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => setOpen(true)}>
          <TextInput
            value={dayjs(date).format('DD MMMM YYYY')}
            editable={false}
            style={styles.input}
            label="Date"
            right={
              <TextInput.Icon
                icon="calendar-outline"
                onPress={() => setOpen(true)}
              />
            }
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
          onPress={() => {
            const formData = new FormData();
            formData.append('date', dayjs(date).format('YYYY-MM-DD'));
            formData.append('remarks', remarks);
            formData.append('distributor_id',id);
            formData.append('assignee', assignee);
            postDistributorSchedule(formData);
          }}>
          Submit
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

export default AddRouteScheduleScreen;
