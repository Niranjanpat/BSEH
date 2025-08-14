import dayjs from 'dayjs';
import React, {useCallback, useRef, useState} from 'react';
import {FlatList, ScrollView, StyleSheet, View} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {ActivityIndicator, Appbar} from 'react-native-paper';
import MonthlyAttendanceList from '../components_new/MonthlyAttendanceList';
import CalendarItemList from '../components_new/CalendarItemList';
import useMonthlyAttendance from '../hook_new/useMonthlyAttendance';

const AttendanceScreen = ({navigation}) => {
  const {
    datas,
    calendar,
    setCalendar,
    loading,
    date,
    setDate,
    handleFetch,
    data,
    setSelectedDate,
  } = useMonthlyAttendance();

  const [openModal, setOpenModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);
  const listRef = useRef();

  const onDateChange = useCallback((_, date) => {
    setOpenModal(false);

    let year = dayjs(date).format('YYYY');
    let month = dayjs(date).format('MM');

    if (date) {
      handleFetch(year, month);
      setDate(dayjs(date).format('YYYY-MM-DD'));
    }
  }, []);

  const calendarMonthChange = useCallback(date => {
    let year = dayjs(date?.dateString).format('YYYY');
    let month = dayjs(date?.dateString).format('MM');

    handleFetch(year, month);

    setDate(dayjs(date?.dateString).format('YYYY-MM-DD'));
  }, []);

  const handleScroll = date => {
    let index = data?.findIndex(
      item =>
        dayjs(item?.date).format('YYYY-MM-DD') ===
        dayjs(date).format('YYYY-MM-DD'),
    );

    if (index >= 0) {
      listRef.current.scrollToIndex({
        animated: true,
        index: index,
      });
    }
  };

  return (
    <>
      {/* <Appbar.Header>
        <Appbar.BackAction
          style={{backgroundColor: '#fff'}}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title={dayjs(date).format('YYYY MMMM')} />
        {calendar && (
          <Appbar.Action
            animated={false}
            icon={showCalendar ? 'calendar-outline' : 'calendar'}
            onPress={() => setShowCalendar(!showCalendar)}
          />
        )}
        <Appbar.Action
          animated={false}
          icon={calendar ? 'format-list-bulleted' : 'calendar-outline'}
          onPress={() => setCalendar(!calendar)}
        />
      </Appbar.Header> */}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator animating={true} />
        </View>
      )}

      {calendar ? (
        <View style={styles.container}>
          {showCalendar && (
            <Calendar
              current={date?.toString()}
              markingType="custom"
              markedDates={datas}
              disableArrowRight={
                dayjs(date).format('YYYY-MM')?.toString() ===
                  dayjs(new Date()).format('YYYY-MM')?.toString() || loading
              }
              disableArrowLeft={loading}
              onMonthChange={calendarMonthChange}
              onDayPress={date => {
                handleScroll(date.dateString);
                setSelectedDate(date.dateString);
              }}
            />
          )}

          <FlatList
            style={styles.flatList}
            ref={listRef}
            data={data}
            initialNumToRender={data?.length}
            keyExtractor={(item, index) => index}
            renderItem={({item}) => <CalendarItemList item={item} />}
          />
        </View>
      ) : (
        <MonthlyAttendanceList
          datas={datas}
          date={date}
          onModalPress={() => setOpenModal(true)}
          onDateChange={onDateChange}
          openModal={openModal}
          loading={loading}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 10,
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    marginVertical: 10,
    width: '100%',
  },
  section: {
    flex: 1,
    alignItems: 'center',
  },
  listContainer: {
    height: '100%',
  },
  picker: {
    marginVertical: 10,
    alignItems: 'center',
  },
  input: {
    width: '80%',
  },
  item: {
    marginVertical: 10,
    flexDirection: 'row',
  },
  flatList: {
    flex: 0,
  },
});

export default AttendanceScreen;
