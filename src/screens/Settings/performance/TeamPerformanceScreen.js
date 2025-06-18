import dayjs from 'dayjs';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LoadingView from '../../../components/LoadingView';
import DayPlanInformation from '../../../components/performance/DayPlanInformation';
import FilterModal from '../../../components/performance/FilterModal';
import MTDPerformance from '../../../components/performance/MTDPerformance';
import MTDThroughput from '../../../components/performance/MTDThroughput';
import ValueInformation from '../../../components/performance/ValueInformation';
import WorkDetail from '../../../components/performance/WorkDetail';
import {COLORS} from '../../../constants/theme/colors';
import usePerformance from '../../../hooks/usePerformance';

const TeamPerformanceScreen = ({navigation, route}) => {
const userData = route?.params?.userData ?? null;
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const {data, loading, fetchMtdPerformanceData} = usePerformance();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Icon name="filter-variant" size={22} onPress={() => setOpen(true)} />
      ),
    });
  }, []);

  useEffect(() => {
    const ids = [];

    if (userData !== null) {
      userData.forEach(item => {
        ids.push(item._id);
      });
    }

    fetchMtdPerformanceData(ids, startDate, endDate);
  }, []);

  const onStarDateChange = useCallback(
    date => {
      setStartDate(date);
      if (dayjs(date).isAfter(endDate)) {
        setEndDate(date);
      }
    },
    [startDate, endDate],
  );
  const onEndDateChange = useCallback(
    date => {
      setEndDate(date);
      if (dayjs(date).isBefore(startDate)) {
        setStartDate(date);
      }
    },
    [startDate, endDate],
  );
  const onUserSelect = useCallback(
    item => setSelectedUsers(item),
    [selectedUsers],
  );
  const onOkClick = useCallback(() => {
    setOpen(false);
    fetchMtdPerformanceData(selectedUsers, startDate, endDate);
  }, [selectedUsers, startDate, endDate]);

  const onCancelClick = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <DayPlanInformation data={data} />
        <WorkDetail data={data} />
        <MTDPerformance data={data} />
        <MTDThroughput data={data} />
        <ValueInformation data={data} />
      </ScrollView>
      {loading && <LoadingView />}
      <FilterModal
        startDate={startDate}
        endDate={endDate}
        selectedUsers={selectedUsers}
        userData={userData}
        visible={open}
        onEndDateChange={onEndDateChange}
        onStarDateChange={onStarDateChange}
        onUserSelect={onUserSelect}
        onOkClick={onOkClick}
        onCancelClick={onCancelClick}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: COLORS.light,
  },
  top: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  inputContainer: {
    width: '40%',
  },
  input: {
    backgroundColor: COLORS.light,
  },
});
export default TeamPerformanceScreen;
