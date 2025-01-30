import dayjs from 'dayjs';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, FlatList, Pressable, StyleSheet, View} from 'react-native';
import MonthPicker from 'react-native-month-year-picker';
import {ActivityIndicator, Appbar, Divider, Subheading, Text, TextInput} from 'react-native-paper';
import {getMonthlyAttendanceTravel} from '../../services/auth_service';
import {COLORS} from '../../constants/theme/colors';

const MonthlyTravelDistance = ({navigation}) => {
  const [openModal, setOpenModal] = useState(false);
  const [distanceList, setDistanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    fetchData();
  }, [date]);

  const fetchData = () => {
    setLoading(true);
    const year = dayjs(date).format('YYYY');
    const month = dayjs(date).format('MM');
    
    getMonthlyAttendanceTravel(year, month)
      .then(res => {
        const {success, data, errors} = res.data;

        if (success) {
          setDistanceList(data.attendances);
        } else {
          if (errors) {
            Alert.alert('Error!', Object.values(errors).join(', '));
          }
        }
      })
      .catch(err => {
        console.log('month err', JSON.stringify(err));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onDateChange = useCallback((_, date) => {
    setOpenModal(false);

    if (date) {
      setDate(date);
    }
  }, []);

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction
          style={{backgroundColor: '#fff'}}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title={dayjs(date).format('YYYY MMMM')} />
      </Appbar.Header>

      <View style={styles.main}>
        <View style={styles.picker}>
          <Pressable
            onPress={() => setOpenModal(true)}
            style={styles.input}
            disabled={loading}>
            <TextInput
              value={dayjs(date).format('MMMM YYYY')}
              mode="outlined"
              label="Select date"
              editable={false}
              style={{flex: 1, backgroundColor: COLORS.light}}
            />
            {loading && <ActivityIndicator style={{position: 'absolute', right: '2%', alignSelf: 'center',}} />}
          </Pressable>
          {openModal && (
            <MonthPicker
              value={date}
              maximumDate={new Date()}
              okButton="Confirm"
              cancelButton="Cancel"
              onChange={onDateChange}
            />
          )}
        </View>

        <View style={styles.container}>
          <View style={[styles.listView, styles.row]}>
            <View style={styles.section}>
              <Subheading style={styles.title}>Punch in</Subheading>
            </View>
            <View style={styles.section}>
              <Subheading style={styles.title}>Punch out</Subheading>
            </View>
            <View style={styles.section}>
              <Subheading style={styles.title}>Distance (KM)</Subheading>
            </View>
          </View>
          <View style={styles.listContainer}>
            <FlatList
              data={distanceList}
              keyExtractor={(_, index) => index}
              ListEmptyComponent={() => (
                <Text style={styles.emptyText}>No data found!</Text>
              )}
              showsVerticalScrollIndicator={false}
              renderItem={({item, index}) => (
                <>
                  <View style={styles.row}>
                    <View style={styles.section}>
                      <Subheading style={styles.data}>
                        {item?.punch_in_time ? item?.punch_in_time : 'N/A'}
                      </Subheading>
                    </View>
                    <View style={styles.section}>
                      <Subheading style={styles.data}>
                        {item?.punch_out_time ? item?.punch_out_time : 'N/A'}
                      </Subheading>
                    </View>
                    <View style={styles.section}>
                      <Subheading style={styles.data}>
                        {item?.advance_distance}
                      </Subheading>
                    </View>
                  </View>
                  <Divider />
                  <Divider />
                </>
              )}
            />
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  listView: {
    backgroundColor: '#D0D1CF',
  },
  row: {
    flexDirection: 'row',
    width: '98%',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginVertical: 5,
    alignSelf: 'center',
  },
  section: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  section2: {flex: 2, alignItems: 'center'},
  listContainer: {
    marginBottom: 20,
  },
  picker: {
    marginVertical: 10,
    alignItems: 'center',
  },
  input: {
    flexDirection: 'row',
    // width: '100%',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  data: {
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
  container: {
    backgroundColor: COLORS.light,
    elevation: 3,
    borderRadius: 10,
    padding: 10,
  },
  main: {
    padding: 5,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 14,
  },
});

export default MonthlyTravelDistance;
