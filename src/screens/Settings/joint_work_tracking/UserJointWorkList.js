import {StyleSheet, View, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getUserJointWorking} from '../../../services/joint_service';
import {Appbar, Caption, Card, Subheading, Text} from 'react-native-paper';
import {COLORS} from '../../../constants/theme/colors';
import {ROUTES} from '../../../constants/routes';
import dayjs from 'dayjs';
import DatePicker from 'react-native-date-picker';
const UserJointWorkList = ({navigation}) => {
  const [jointWorkList, setJointWorkList] = useState([]);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchJointWorking = (date, page) => {
    setLoading(true);
    getUserJointWorking(dayjs(date).format('YYYY-MM-DD'), page)
      .then(res => {
        setLoading(false);

        console.log(res.data.data);

        setHasMore(res.data.data.has_more);
        if (page === 1) {
          setJointWorkList(res.data.data.joint_workings);
        } else {
          setJointWorkList(jointWorkList.concat(res.data.data.joint_workings));
        }
      })
      .catch(e => {
        setLoading(false);
        console.log(e);
      });
  };

  useEffect(() => {
    fetchJointWorking(date, 1);
  }, []);
  return (
    <View>
      <Appbar.Header style={{backgroundColor: '#fff'}}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Jointwork List" />
        <Appbar.Action
          icon="calendar"
          onPress={() => {
            setOpen(true);
          }}
        />
      </Appbar.Header>
      <Subheading style={{marginLeft: 10}}>
        Date: {dayjs(date).format('DD MMM YYYY')}
      </Subheading>
      <DatePicker
        modal
        open={open}
        date={date}
        mode="date"
        onConfirm={date => {
          setOpen(false);
          setDate(date);
          setPage(1);
          fetchJointWorking(date, 1);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      <FlatList
        style={{padding: 10}}
        refreshing={loading}
        onRefresh={() => {
          setPage(1);
          fetchJointWorking(date, 1);
        }}
        ListFooterComponent={() => <View style={{height: 90}}></View>}
        data={jointWorkList}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (!loading && hasMore) {
            setPage(prev => prev + 1);
            fetchJointWorking(date, page + 1);
          }
        }}
        ListEmptyComponent={() => (
          <Text style={{alignSelf: 'center'}}>Joint Work Unavailable!</Text>
        )}
        renderItem={({item}) => (
          <Card
            style={styles.container}
            onPress={() =>
              navigation.navigate(ROUTES.joint_work_map, {id: item._id})
            }>
            <Caption style={styles.txtCollab} numberOfLines={1}>
              Joint work
            </Caption>
            <View style={styles.row}>
              <View style={styles.details}>
                <Text>Start Time: {item.start_time}</Text>
                <Caption>Host</Caption>
                <Text>{item.host_name}</Text>
                <Caption>({item.host_role})</Caption>
              </View>
              <View style={styles.details}>
                <Text>
                  End Time: {item.end_time ? item.end_time : ' _ _ : _ _'}
                </Text>
                <Caption>Guest</Caption>
                <Text>{item.guest_name}</Text>
                <Caption>({item.guest_role})</Caption>
              </View>
              <View style={{width: 10}} />
            </View>
          </Card>
        )}
      />
    </View>
  );
};

export default UserJointWorkList;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 10,
  },
  txtCollab: {
    fontSize: 14,
    color: COLORS.primaryDark,
  },

  row: {
    flexDirection: 'row',
  },

  details: {
    flex: 1,
  },
});
