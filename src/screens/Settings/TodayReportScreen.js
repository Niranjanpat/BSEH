import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LoadingView from '../../components/LoadingView';
import AttendanceInformation from '../../components/settings/AttendanceInformation';
import CallDetails from '../../components/settings/CallDetails';
import OfficialInformation from '../../components/settings/OfficialInformation';
import OrderDetails from '../../components/settings/OrderDetails';
import {ROUTES} from '../../constants/routes';
import {COLORS} from '../../constants/theme/colors';
import useReport from '../../hooks/useReport';

const TodayReportScreen = ({navigation, route}) => {
  const {loading, data, fetchTodayReport, fetchTodayReportById} = useReport();

  const {id} = route.params;

  useFocusEffect(
    useCallback(() => {
      if (!id) {
        fetchTodayReport();
      } else {
        fetchTodayReportById(id);
      }
    }, []),
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <OfficialInformation data={data} />
      <AttendanceInformation data={data} />
      <CallDetails data={data} />
      <OrderDetails data={data} />
      {!id && (
        <Pressable onPress={() => navigation.navigate(ROUTES.kam_mtd)}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>View MTD report</Text>
            <Icon name="chevron-right-circle" size={23} color={COLORS.light} />
          </View>
        </Pressable>
      )}
      {loading && <LoadingView />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: COLORS.light,
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
});

export default TodayReportScreen;
