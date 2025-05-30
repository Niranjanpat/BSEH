import dayjs from 'dayjs';
import React, {useEffect, useRef, useState} from 'react';
import {Alert, FlatList, Image, StyleSheet, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Appbar, Divider, Subheading, Text, TextInput} from 'react-native-paper';
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
          <Text variant="titleMedium" style={styles.text}>
            Punch In
          </Text>
          <Text variant="titleMedium" style={styles.text}>
            Punch Out
          </Text>
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
                <View style={{paddingBottom: 8}}>
                  <View style={styles.listItemContainer}>
                    <View style={styles.listItem}>
                      <Image
                        source={{uri: item.punch_in_photo_path}}
                        style={styles.listItemImage}
                      />
                      <View style={{flex: 1}}>
                        <Text>{item.punch_in_time}</Text>
                        <Text
                          style={{flexWrap: 'wrap'}}
                          numberOfLines={2}
                          ellipsizeMode="tail">
                          Reading: {item.start_vehicle_km}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.listItem}>
                      <Image
                        source={{uri: item.punch_out_photo_path}}
                        style={styles.listItemImage}
                      />
                      <View style={{flex: 1}}>
                        <Text>{item.punch_out_time}</Text>
                        <Text
                          style={{flexWrap: 'wrap'}}
                          numberOfLines={2}
                          ellipsizeMode="tail">
                          Reading: {item.end_vehicle_km}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text variant="labelMedium">
                    Vehicle Type: {item.vehicle_type?.toUpperCase()}
                  </Text>
                  <Text variant="labelMedium">
                    Total Distance: {item.total_vehicle_km} KMs
                  </Text>
                  <Divider
                    style={{
                      backgroundColor: COLORS.primary,
                      height: 1,
                      marginTop: 2,
                    }}
                  />
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
    flex: 1,
  },
  attendanceListContainer: {
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
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    flex: 1,
  },
  listItemImage: {
    height: 60,
    width: 60,
    borderRadius: 10,
    marginEnd: 8,
    resizeMode: 'cover',
  },
});
