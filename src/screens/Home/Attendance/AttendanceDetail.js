import dayjs from 'dayjs';
import React, {useEffect, useRef, useState} from 'react';
import {Alert, FlatList, StyleSheet, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Appbar, Divider, Subheading, Text, TextInput} from 'react-native-paper';
import {COLORS} from '../../../constants/theme/colors';
import {attendanceList} from '../../../services/auth_service';
import DateMonthSelector from '../../../components/attendance/DateMonthSelector';
import AttendanceListItem from '../../../components/attendance/AttendanceListItem';

const AttendanceDetail = ({navigation}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const date = useRef(new Date());

  useEffect(() => {
    getAttendanceDetail();
  }, []);

  const getAttendanceDetail = () => {
    setLoading(true);
    attendanceList(dayjs(date.current).format('YYYY-MM-DD'))
      .then(res => {
        const {data, errors, success} = res.data;
        if (success) {
          setData(data.attendances);
        } else {
          if (errors) {
            Alert.alert('Error!', Object.values(errors).join(', '));
          }
        }
      })
      .catch(e => {})
      .finally(() => setLoading(false));
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
          <Text variant="titleMedium" style={styles.text}>
            Punch In
          </Text>
          <Text variant="titleMedium" style={styles.text}>
            Punch Out
          </Text>
        </View>
        <View style={styles.attendanceListContainer}>
          <FlatList
            refreshing={loading}
            onRefresh={() => getAttendanceDetail()}
            ListEmptyComponent={() => {
              return <Text>no data</Text>;
            }}
            showsVerticalScrollIndicator={false}
            data={data}
            keyExtractor={item => '' + item._id}
            renderItem={({item}) => <AttendanceListItem item={item} />}
          />
        </View>
      </View>
    </View>
  );
};

export default AttendanceDetail;

const styles = StyleSheet.create({
  attendanceBox: {
    flex: 1,
    width: '100%',
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  text: {
    marginTop: 5,
    color: COLORS.accentPrimary,
    flex: 1,
  },
  attendanceListContainer: {
    flex: 1,
    width: '95%',
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 10,
    justifyContent: 'center',
  },
  attendanceContainer: {
    width: '95%',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
  },
});
