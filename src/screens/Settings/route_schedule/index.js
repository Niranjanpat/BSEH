import {View, Text, StyleSheet, FlatList, Pressable} from 'react-native';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useRouteSchedule from '../../../hooks/useRouteSchedule';
import {COLORS} from '../../../constants/theme/colors';
import FilterModal from '../../../components/route_scheule/FilterModal';
import dayjs from 'dayjs';
import EmptyView from '../../../components/EmptyView';
import {ROUTES} from '../../../constants/routes';
import RouteScheduleCard from '../../../components/route_scheule/RouteScheduleCard';

const RouteScheduleListScreen = ({navigation}) => {
  const isFocused = useIsFocused();

  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [visible, setVisible] = useState(false);

  const {hasMore, loading, routeSchedules, fetchRouteSchedules} =
    useRouteSchedule();

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
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchRouteSchedules(page, startDate, endDate);
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
    fetchRouteSchedules(1, startDate, endDate);
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
      <Pressable
        style={styles.fab}
        onPress={() => navigation.navigate(ROUTES.add_route_schedule)}>
        <Icon name="plus" color={COLORS.light} size={22} />
      </Pressable>
      <FlatList
        data={routeSchedules}
        contentContainerStyle={styles.list}
        refreshing={loading}
        showsVerticalScrollIndicator={false}
        onRefresh={() => {
          setPage(1);
          fetchRouteSchedules(1, startDate, endDate);
        }}
        renderItem={({item}) => <RouteScheduleCard item={item} />}
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

            fetchRouteSchedules(page + 1, startDate, endDate);
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
  fab: {
    position: 'absolute',
    height: 50,
    width: 50,
    borderRadius: 100,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: '5%',
    right: '5%',
    zIndex: 99999,
  },
  icon: {
    marginLeft: 10,
    color: COLORS.accentSecondary,
  },
});

export default RouteScheduleListScreen;
