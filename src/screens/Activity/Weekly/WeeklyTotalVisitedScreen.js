import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
import {List, Text} from 'react-native-paper';
import {ROUTES} from '../../../constants/routes';
import {COLORS} from '../../../constants/theme/colors';

const WeeklyTotalVisitedScreen = ({navigation}) => {
  const [date, setDate] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getSevenDaysAttendance();
  }, []);
  const getSevenDaysAttendance = () => {
    let dates = [];

    for (let i = 1; i <= 7; i++) {
      dates.push(dayjs().subtract(i, 'days'));
    }
    setDate(dates);
    console.log(dates);
  };
  return (
    <View>
      <FlatList
        data={date}
        refreshing={isLoading}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => {
          return <Text>No iTem</Text>;
        }}
        // keyExtractor={(item, _) => item}
        renderItem={({item}) => {
          return (
            <List.Item
              onPress={() => {
                navigation.navigate(ROUTES.total_visited, {
                  date: item.toString(),
                });
              }}
              style={styles.list}
              titleStyle={{fontWeight: 'bold'}}
              title={dayjs(item).format('YYYY MMM DD')}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
          );
        }}
      />
    </View>
  );
};

export default WeeklyTotalVisitedScreen;
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  search: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
  },
  list: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
  },
  listRight: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  chip: {
    backgroundColor: COLORS.accentPrimary,
    color: '#fff',
    flexGrow: 0,
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
});
