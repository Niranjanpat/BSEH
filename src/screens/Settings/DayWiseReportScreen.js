import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Text, TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LoadingView from '../../components/LoadingView';
import AttendanceInformation from '../../components/settings/AttendanceInformation';
import CallDetails from '../../components/settings/CallDetails';
import OfficialInformation from '../../components/settings/OfficialInformation';
import OrderDetails from '../../components/settings/OrderDetails';
import {ROUTES} from '../../constants/routes';
import {COLORS} from '../../constants/theme/colors';
import useReport from '../../hooks/useReport';

const DayWiseReportScreen = ({navigation, route}) => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const {loading, data, fetchDailyComplianceReport} = useReport();

  const {id} = route.params;

  useEffect(() => {
    fetchDailyComplianceReport(id, date);
  }, []);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setOpen(true)}>
        <TextInput
          value={dayjs(date).format('DD MMMM YYYY, dddd')}
          editable={false}
          label="Date"
          style={styles.input}
        />
      </Pressable>
      <DatePicker
        date={date}
        maximumDate={new Date()}
        modal
        open={open}
        mode="date"
        onCancel={() => setOpen(false)}
        onConfirm={date => {
          setOpen(false);
          setDate(date);
          fetchDailyComplianceReport(id, date);
        }}
      />
      {Object.keys(data).length !== 0 && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <OfficialInformation data={data} />
          <AttendanceInformation data={data} />
          <CallDetails data={data} />
          <OrderDetails data={data} />
          {!id && (
            <Pressable onPress={() => navigation.navigate(ROUTES.kam_mtd)}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>View MTD report</Text>
                <Icon
                  name="chevron-right-circle"
                  size={23}
                  color={COLORS.light}
                />
              </View>
            </Pressable>
          )}
        </ScrollView>
      )}
      {loading && <LoadingView />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: COLORS.light,
    flex: 1,
  },
  button: {
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 30,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
  },
  input: {
    marginVertical: 10,
    backgroundColor: COLORS.light,
  },
});

export default DayWiseReportScreen;
