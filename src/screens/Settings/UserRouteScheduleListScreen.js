import {View, Text, StyleSheet, FlatList, Alert} from 'react-native';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import useUserRouteSchedule from '../../hooks/useUserRouteSchedule';
import {COLORS} from '../../constants/theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import UserFilterModal from '../../components/route_scheule/UserFilterModal';
import UserRouteScheduleCard from '../../components/route_scheule/UserRouteScheduleCard';
import EmptyView from '../../components/EmptyView';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import LoadingView from '../../components/LoadingView';
import dayjs from 'dayjs';

const UserRouteScheduleListScreen = ({navigation}) => {
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [status, setStatus] = useState('');
  const [open, setOpen] = useState(false);
  const [ids, setIds] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <Icon
            name="close"
            size={22}
            onPress={onRejectPress}
            style={styles.icon}
          />
          <MaterialIcon
            name="done"
            size={22}
            onPress={onApprovePress}
            style={styles.icon}
          />
          <Icon
            name="filter-variant"
            size={22}
            onPress={() => setOpen(true)}
            style={styles.icon}
          />
        </>
      ),
    });
  }, [ids]);

  const {
    hasMore,
    loading,
    userRouteSchedules,
    actionLoading,
    bulkApproveScheules,
    bulkRejectSchedules,
    fetchUserRouteSchedule,
  } = useUserRouteSchedule();

  const onSuccess = () => {
    setPage(1);
    fetchUserRouteSchedule(1, startDate, endDate, status);
  };

  const onApprovePress = () => {
    if (ids.length === 0) {
      Alert.alert('Error', 'No route schedule has been selected');
      return;
    }

    Alert.alert('Confirm', 'Proceed to approve route schedules', [
      {
        text: 'Cancel',
      },
      {
        text: 'Confirm',
        onPress: () => bulkApproveScheules(ids, onSuccess),
      },
    ]);
  };

  const onRejectPress = () => {
    if (ids.length === 0) {
      Alert.alert('Error', 'No route schedule has been selected');
      return;
    }

    Alert.alert('Confirm', 'Proceed to reject route schedules', [
      {
        text: 'Cancel',
      },
      {
        text: 'Confirm',
        onPress: () => bulkRejectSchedules(ids, onSuccess),
      },
    ]);
  };

  useEffect(() => {
    fetchUserRouteSchedule(page, startDate, endDate, status);
  }, []);

  const onStartDateChange = useCallback(
    date => {
      if (dayjs(date).isAfter(endDate)) {
        setEndDate(date);
      }

      setStartDate(date);
    },
    [startDate, endDate],
  );

  const onEndDateChange = useCallback(
    date => {
      if (dayjs(date).isBefore(startDate)) {
        setStartDate(date);
      }

      setEndDate(date);
    },
    [startDate, endDate],
  );

  const onStatusChange = useCallback(val => setStatus(val), [status]);

  const onOkClick = useCallback(() => {
    setIds([]);
    setOpen(false);
    setPage(1);
    fetchUserRouteSchedule(1, startDate, endDate, status);
  }, [open, startDate, endDate, status, page]);

  const onClick = useCallback(
    id => {
      let temp = [...ids];

      if (temp.findIndex(item => item === id) <= -1) {
        temp.push(id);
      } else {
        temp = temp.filter(item => item !== id);
      }

      setIds(temp);
    },
    [ids],
  );

  return (
    <View style={styles.container}>
      {actionLoading && <LoadingView />}
      <UserFilterModal
        visible={open}
        startDate={startDate}
        endDate={endDate}
        status={status}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
        onStatusChange={onStatusChange}
        onOkClick={onOkClick}
      />
      <FlatList
        data={userRouteSchedules}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={() => {
          setPage(1);
          fetchUserRouteSchedule(1, startDate, endDate, status);
        }}
        renderItem={({item}) => {
          const isSelected = ids.findIndex(e => e === item._id) > -1;

          return (
            <UserRouteScheduleCard
              item={item}
              isSelected={isSelected}
              onClick={onClick}
            />
          );
        }}
        ListEmptyComponent={
          <EmptyView icon="map-marker" label="No route schedule found" />
        }
        onEndReached={() => {
          if (!loading && hasMore) {
            setPage(prev => prev + 1);
            fetchUserRouteSchedule(page + 1, startDate, endDate, status);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  list: {
    padding: 10,
  },
  icon: {
    marginLeft: 10,
  },
});

export default UserRouteScheduleListScreen;
