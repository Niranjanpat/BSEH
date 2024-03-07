import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Appbar, Caption, Card, Subheading, Text} from 'react-native-paper';
import {COLORS} from '../../constants/theme/colors';
import {ROUTES} from '../../constants/routes';
import {getJointWorkingList} from '../../services/joint_service';
const UserJointWorkList = ({navigation}) => {
  const [jointWorkList, setJointWorkList] = useState([]);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const fetchJointWorking = date => {
    setLoading(true);
    getJointWorkingList(dayjs(date).format('YYYY-MM-DD'))
      .then(res => {
        setLoading(false);

        console.log(res.data.data);

        setJointWorkList(res.data.data.joint_workings);
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
          fetchJointWorking(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      <FlatList
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={() => {
          fetchJointWorking(date);
        }}
        ListFooterComponent={() => <View style={{height: 90}}></View>}
        data={jointWorkList}
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
                <Subheading>Guest details</Subheading>
                <Text style={styles.title}>{item.guest_name}</Text>
                <Caption>({item.guest_role})</Caption>
              </View>
              <View style={styles.details}>
                <Text>
                  End Time: {item.end_time ? item.end_time : ' _ _ : _ _'}
                </Text>
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
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: COLORS.light,
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
  list: {
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
  },
});
