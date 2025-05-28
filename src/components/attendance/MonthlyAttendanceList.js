import dayjs from 'dayjs';
import React from 'react';
import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import MonthPicker from 'react-native-month-year-picker';
import {Divider, Subheading, Text, TextInput} from 'react-native-paper';
import { COLORS } from '../../constants/theme/colors';

const MonthlyAttendanceList = ({
  datas,
  onModalPress,
  date,
  openModal,
  onDateChange,
  loading = false,
}) => {
  return (
    <View style={styles.main}>
      <View style={styles.picker}>
        <Pressable
          onPress={onModalPress}
          style={styles.input}
          disabled={loading}>
          <TextInput
            value={dayjs(date).format('MMMM YYYY')}
            mode="outlined"
            label="Select date"
            editable={false}
            style={{backgroundColor: COLORS.light}}
          />
        </Pressable>
        {openModal && (
          <MonthPicker
            value={new Date()}
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
            <Subheading style={styles.title}>Date</Subheading>
          </View>
          <View style={styles.section}>
            <Subheading style={styles.title}>Punch in</Subheading>
          </View>
          <View style={styles.section}>
            <Subheading style={styles.title}>Punch out</Subheading>
          </View>
          <View style={styles.section}>
            <Subheading style={styles.title}>Status</Subheading>
          </View>
          <View style={styles.section}>
            <Subheading style={styles.title}>Purpose/reason</Subheading>
          </View>
        </View>
        <View style={styles.listContainer}>
          <FlatList
            data={datas}
            keyExtractor={(_, index) => index}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>No data found!</Text>
            )}
            renderItem={({item, index}) => (
              <>
                <Divider />
                <Divider />
                <View style={styles.row}>
                  <View style={styles.section}>
                    <Subheading style={styles.data}>
                      {item?.date ? item?.date : 'N/A'}
                    </Subheading>
                  </View>
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
                      {item?.status ? item.status : 'No data'}
                    </Subheading>
                  </View>
                  <View style={styles.section}>
                    <Subheading style={styles.data}>
                      {item?.absent_reason_text
                        ? item?.absent_reason_text
                        : item?.present_reason_text
                        ? item?.present_reason_text
                        : 'N/A'}
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
    padding: 5,
    marginVertical: 5,
    alignSelf: 'center',
  },
  section: {
    flex: 1,
    alignItems: 'center',
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
    width: '80%',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  data: {
    fontWeight: '600',
    fontSize: 12,
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

export default MonthlyAttendanceList;
