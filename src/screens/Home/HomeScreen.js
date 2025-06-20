import React from 'react';
import {useSelector} from 'react-redux';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';

import Achievement from '../../components/Achievement';
import TodayOrder from '../../components/TodayOrder';
import TopCustomerTable from '../../components/TopCustomerTable';
import WelcomeMessage from '../../components/WelcomeMessage';
import WeeklyOrderLog from '../../components/WeeklyOrderLog';
import RecentOrder from '../../components/RecentOrder';
import AttendanceSummary from '../../components/AttendanceSummary';
import DsmCurrentTarget from '../../components/DsmCurrentTarget';
import JointWorkingView from '../../components/JointWorkingView';
import PromoterVisits from '../../components/PromoterVisits';
import useReport from '../../hooks/useReport';
import AttendanceInformation from '../../components/settings/AttendanceInformation';
import CallDetails from '../../components/settings/CallDetails';
import OrderDetails from '../../components/settings/OrderDetails';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import LoadingView from '../../components/LoadingView';

const HomeScreen = ({}) => {
  const {role} = useSelector(state => state.auth);
  const {loading, data, fetchTodayReport} = useReport();

  useFocusEffect(
    useCallback(() => {
      fetchTodayReport();
    }, []),
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <SafeAreaView>
        <WelcomeMessage />
        <JointWorkingView />
        {role === 'promoter' && <PromoterVisits />}
        {/* {role !== 'promoter' && <TodayOrder self={1} />} */}
        {role === 'sc' || role === 'asm' ? (
          <>
            {/* <Achievement /> */}
            <>
              {/* <DsmCurrentTarget /> */}
              <AttendanceInformation data={data} />
              <CallDetails data={data} />
              {/* <OrderDetails data={data} /> */}
              {loading && <LoadingView />}
            </>

            {/* <RecentOrder /> */}
          </>
        ) : (
          <>{role !== 'promoter' && <AttendanceSummary />}</>
        )}
        {/* {role === 'asm' && <RecentOrder />}  */}
        {role !== 'promoter' && (
          <>
            {/* <TopCustomerTable /> */}
            {/* <WeeklyOrderLog /> */}
          </>
        )}
        <View style={styles.margin_bottom}></View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  margin_bottom: {
    marginBottom: 30,
  },
});
