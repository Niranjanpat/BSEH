import {View, StyleSheet} from 'react-native';
import React, {memo} from 'react';
import {COLORS} from '../../constants/theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text} from 'react-native-paper';
import dayjs from 'dayjs';

const AllUsersList = ({item, onAbentClick, date}) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.row}>
          <Icon name="account" size={20} />
          <Text numberOfLines={1} style={styles.text}>
            {item?.name ? item?.name : 'N/A'}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="tie" size={20} />
          <Text numberOfLines={1} style={styles.text}>
            {item?.emp_code ? item?.emp_code : 'N/A'}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="briefcase" size={20} />
          <Text numberOfLines={1} style={styles.text}>
            {item?.role ? item?.role?.toUpperCase() : 'N/A'}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="calendar" size={20} />
          <Text numberOfLines={1} style={[styles.text, {color: item?.status === 'present' ? 'green' : item?.status === 'absent' ? 'red' : null}]}>
            {item?.status ? item?.status?.toUpperCase() : 'Not marked'}
          </Text>
        </View>
      </View>
      <View style={styles.right}>
        {!item?.status &&
          item?.is_child &&
          !dayjs(date).isBefore(new Date(), 'day') && (
            <Icon
              name="calendar-remove"
              onPress={() => onAbentClick(item?._id)}
              style={{
                padding: 10,
                backgroundColor: COLORS.error,
                borderRadius: 5,
              }}
              color={COLORS.light}
              size={22}
            />
          )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: COLORS.light,
    elevation: 3,
    marginHorizontal: 2,
    flexDirection: 'row',
  },
  left: {
    flex: 4,
  },
  right: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    marginVertical: 3,
  },
  text: {
    paddingHorizontal: 10,
    overflow: 'hidden',
  },
});

export default memo(AllUsersList);
