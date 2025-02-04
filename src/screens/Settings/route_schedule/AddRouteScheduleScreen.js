import {Picker} from '@react-native-picker/picker';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Button, TextInput} from 'react-native-paper';
import {COLORS} from '../../../constants/theme/colors';
import useRouteSchedule from '../../../hooks/useRouteSchedule';

const AddRouteScheduleScreen = () => {
  const [date, setDate] = useState(new Date());
  const [routeId, setRouteId] = useState('');
  const [remarks, setRemarks] = useState('');
  const [open, setOpen] = useState(false);

  const {routes, loading, fetchRoutes, postRouteSchedule} = useRouteSchedule();
  
  useEffect(() => {
    fetchRoutes();
  }, []);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => setOpen(true)}>
          <TextInput
            value={dayjs(date).format('DD MMMM YYYY')}
            editable={false}
            style={styles.input}
            label="Date"
            right={<TextInput.Icon icon="calendar-outline" />}
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
        <View style={styles.picker}>
          <Picker style={{color:'black'}} dropdownIconColor='black' selectedValue={routeId} onValueChange={setRouteId}>
            <Picker.Item value="" label="Select beat" />
            {routes.map(item => (
              <Picker.Item key={item._id} value={item._id} label={item.name} />
            ))}
          </Picker>
        </View>
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
            postRouteSchedule({
              date: dayjs(date).format('YYYY-MM-DD'),
              route_id: routeId,
              remarks,
            })
          }>
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
  picker: {
    elevation: 3,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.light,
  },
  btn: {
    marginVertical: 20,
  },
});

export default AddRouteScheduleScreen;
