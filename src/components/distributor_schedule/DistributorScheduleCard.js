import {View, StyleSheet, Pressable} from 'react-native';
import React, {memo} from 'react';
import {COLORS} from '../../constants/theme/colors';
import {Subheading, Text} from 'react-native-paper';
import dayjs from 'dayjs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../constants/routes';

const DistributorScheduleCard = ({item}) => {
  const {navigate} = useNavigation();

  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        navigate(ROUTES.distributor_schedule_details, {
          id: item._id,
          status: item.status,
        })
      }>
      <Subheading style={styles.title}>
        {dayjs(item.date).format('DD MMMM YYYY')}
      </Subheading>

      <View style={styles.row}>
        <View style={styles.left}>
          <View style={styles.row}>
            <Icon name="account" size={22} />
            <Text style={styles.text}>{item.distributor_name || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="briefcase" size={22} />
            <Text style={styles.text}>
              {item.distributor_sap_code || 'N/A'}
            </Text>
          </View>
          <View style={styles.row}>
            <Icon name="comment-processing" size={22} />
            <Text style={styles.text}>{item.remarks || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.right}>
          <Text style={[styles.status, styles[item.status || 'pending']]}>
            {item.status}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    padding: 10,
    elevation: 3,
    borderRadius: 10,
    backgroundColor: COLORS.light,
  },
  title: {
    marginVertical: 5,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  row: {
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    paddingHorizontal: 10,
  },
  left: {
    flex: 5,
    justifyContent: 'center',
  },
  right: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  status: {
    padding: 10,
    color: COLORS.light,
    borderRadius: 10,
    textTransform: 'capitalize',
  },
  approved: {
    backgroundColor: COLORS.success,
  },
  rejected: {
    backgroundColor: COLORS.error,
  },
  pending: {
    backgroundColor: COLORS.accentPrimary,
  },
  cancelled: {
    backgroundColor: COLORS.accentPrimary,
  },
});

export default memo(DistributorScheduleCard);
