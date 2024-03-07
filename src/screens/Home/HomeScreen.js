import React from 'react';
import {useSelector} from 'react-redux';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';

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

const HomeScreen = ({}) => {
  const {role} = useSelector(state => state.auth);
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <SafeAreaView>
        <WelcomeMessage />
        <JointWorkingView />
        {role === 'promoter' && <PromoterVisits />}
        {role !== 'promoter' && <TodayOrder self={1} />}
        {role === 'dsm' && <RecentOrder />}
        {role === 'kam' || role === 'sales-officer' ? (
          <>
            <Achievement />
            {role === 'kam' && <DsmCurrentTarget />}
            <RecentOrder />
          </>
        ) : (
          <>{role !== 'promoter' && <AttendanceSummary />}</>
        )}
        {role !== 'promoter' && (
          <>
            <TopCustomerTable />
            <WeeklyOrderLog />
          </>
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
