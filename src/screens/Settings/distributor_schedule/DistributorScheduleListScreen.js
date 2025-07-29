import {View, Text, StyleSheet, FlatList, Pressable} from 'react-native';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useDistributorSchedule from '../../../hooks/useDistributorSchedule';
import {COLORS} from '../../../constants/theme/colors';
import FilterModal from '../../../components/route_scheule/FilterModal';
import dayjs from 'dayjs';
import EmptyView from '../../../components/EmptyView';
import DistributorScheduleCard from '../../../components/distributor_schedule/DistributorScheduleCard';
import TabFilter from '../../../components/TabFilter';

const DistributorScheduleListScreen = ({navigation}) => {
  const isFocused = useIsFocused();

  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [visible, setVisible] = useState(false);


  const {hasMore, loading, distributorSchedules, fetchDistributorSchedules} =
    useDistributorSchedule();
  console.log('distributorSchedules', distributorSchedules);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Icon
          name="filter-variant"
          size={22}
          style={styles.icon}
          onPress={() => setVisible(true)}
        />
      ),
    });
  }, [])

  useEffect(() => {
    if (isFocused) {
      fetchDistributorSchedules(page, startDate, endDate);
    }

    return () => {
      setPage(1);
    };
  }, [isFocused]);

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

  const onOkClick = useCallback(() => {
    setVisible(false);
    setPage(1);
    fetchDistributorSchedules(1, startDate, endDate);
  }, [visible, startDate, endDate, page]);

  return (
    <View style={styles.container}>
      <FilterModal
        visible={visible}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
        onOkClick={onOkClick}
      />
      <FlatList
        data={distributorSchedules}
        contentContainerStyle={styles.list}
        refreshing={loading}
        showsVerticalScrollIndicator={false}
        onRefresh={() => {
          setPage(1);
          fetchDistributorSchedules(1, startDate, endDate);
        }}
        renderItem={({item}) => <DistributorScheduleCard item={item} />}
        ListEmptyComponent={
          <EmptyView
            icon="map-marker-distance"
            label={`No data found for ${dayjs(startDate).format(
              'DD MMMM YYYY',
            )} - ${dayjs(endDate).format('DD MMMM YYYY')}`}
          />
        }
        onEndReached={() => {
          if (!loading && hasMore) {
            setPage(prev => prev + 1);

            fetchDistributorSchedules(page + 1, startDate, endDate);
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
    color: COLORS.accentSecondary,
  },
});

export default DistributorScheduleListScreen;
