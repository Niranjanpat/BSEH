import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Appbar, Subheading, Text, TextInput} from 'react-native-paper';
import {COLORS} from '../../../constants/theme/colors';
import {attendanceList} from '../../../services/auth_service';

const AttendanceDetail = ({navigation}) => {
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [showDate, setShowDate] = useState(false);
  useEffect(() => {
    getAttendanceDetail();
  }, [date]);

  const getAttendanceDetail = () => {
    attendanceList(dayjs(date).format('YYYY-MM-DD'))
      .then(res => {
        const {data, errors, success} = res.data;
        if (success) {
          console.log(data);
          setData(data.attendances);
        } else {
        }
      })
      .catch(e => {});
  };

  return (
    <View style={{flex: 1}}>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title="Attendance" />
      </Appbar.Header>
      <View style={styles.dateContainer}>
        <TextInput
          label="Start Date"
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
          }}
          onCancel={() => {
            setShowDate(false);
          }}
        />
      </View>
      <View style={styles.attendanceBox}>
        <View style={styles.attendanceContainer}>
          <Text style={styles.text}>Punch Out</Text>
          <Text style={styles.text}>Punch In</Text>
        </View>
        <View style={styles.attendanceListContainer}>
          <FlatList
            ListEmptyComponent={() => {
              return <Text>no data</Text>;
            }}
            data={data}
            keyExtractor={item => '' + item._id}
            renderItem={({item}) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <Text>{item.punch_in_time}</Text>
                  <Text>{item.punch_out_time}</Text>
                </View>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default AttendanceDetail;
const styles = StyleSheet.create({
  attendanceBox: {
    width: '100%',
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  dateContainer: {
    margin: 10,
  },
  switchStyle: {
    marginHorizontal: 10,
  },
  text: {
    marginTop: 5,
    color: COLORS.accentPrimary,
  },
  attendanceListContainer: {
    width: '90%',
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: '#fff',
    paddingVertical: 10,
    justifyContent: 'center',
  },
  attendanceContainer: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
  },
});
