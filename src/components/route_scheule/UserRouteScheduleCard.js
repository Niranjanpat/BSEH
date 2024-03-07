import {View, StyleSheet, Pressable} from 'react-native';
import React, {memo} from 'react';
import {COLORS} from '../../constants/theme/colors';
import {Checkbox, Subheading, Text} from 'react-native-paper';
import dayjs from 'dayjs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const UserRouteScheduleCard = ({item, isSelected, onClick}) => {
  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        if (item.status === 'pending') {
          onClick(item._id);
        }
      }}>
      <View style={styles.left}>
        {item.status === 'pending' && (
          <Checkbox status={isSelected ? 'checked' : 'unchecked'} />
        )}
      </View>
      <View style={styles.right}>
        <Subheading style={styles.title}>
          {dayjs(item.date).format('DD MMMM YYYY')} ({item.status})
        </Subheading>
        <View style={styles.row}>
          <Icon name="map-marker" size={22} />
          <Text style={styles.text} numberOfLines={2}>
            {item.route_name} ({item.route_sap_code})
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="account" size={22} />
          <Text style={styles.text}>
            {item.user_name} ({item.user_emp_code})
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="cog" size={22} />
          <Text style={styles.text}>{item.user_role}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="comment-processing" size={22} />
          <Text style={styles.text}>{item.remarks}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  left: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    flex: 8,
    padding: 10,
    elevation: 3,
    backgroundColor: COLORS.light,
    borderRadius: 10,
  },
  title: {
    fontWeight: 'bold',
    color: COLORS.primary,
    textTransform: 'capitalize',
  },
  row: {
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    paddingHorizontal: 10,
  },
  approved: {
    color: COLORS.success,
  },
  rejected: {
    color: COLORS.error,
  },
  pending: {
    color: COLORS.accentPrimary,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subSection: {
    flex: 1,
  },
});

export default memo(UserRouteScheduleCard);
