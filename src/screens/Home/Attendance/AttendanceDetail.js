import dayjs from 'dayjs';
import React, {useEffect, useRef, useState} from 'react';
import {Alert, FlatList, StyleSheet, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Appbar, Subheading, Text, TextInput} from 'react-native-paper';
import {COLORS} from '../../../constants/theme/colors';
import {attendanceList} from '../../../services/auth_service';
import DateMonthSelector from '../../../components/attendance/DateMonthSelector';

const AttendanceDetail = ({navigation}) => {
  const [data, setData] = useState([]);
  const date = useRef(new Date());

  useEffect(() => {
    getAttendanceDetail();
  }, []);

  const getAttendanceDetail = () => {
    attendanceList(dayjs(date.current).format('YYYY-MM-DD'))
      .then(res => {
        const {data, errors, success} = res.data;
        if (success) {
          console.log(data);
          setData(data.attendances);
        } else {
          if (errors) {
            Alert.alert('Error!', Object.values(errors).join(', '));
          }
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
      <DateMonthSelector
        onDateSelect={d => {
          date.current = d;
          getAttendanceDetail();
        }}
      />
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
