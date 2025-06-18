import {View, StyleSheet} from 'react-native';
import React, {memo} from 'react';
import {COLORS} from '../../constants/theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text} from 'react-native-paper';

const UsersList = ({item}) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.row}>
          <Icon name="account" size={20} />
          <Text numberOfLines={1} style={styles.text}>
            {item?.user_name ? item?.user_name : 'N/A'}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="tie" size={20} />
          <Text numberOfLines={1} style={styles.text}>
            {item?.user_emp_code ? item?.user_emp_code : 'N/A'}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="briefcase" size={20} />
          <Text numberOfLines={1} style={styles.text}>
            {item?.user_role ? item?.user_role : 'N/A'}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="calendar" size={20} />
          <Text numberOfLines={1} style={styles.text}>
            {item?.status ? item?.status : 'Not marked'}
          </Text>
        </View>
      </View>
      <View style={styles.right}>
        {!item?.status && item?.is_child && (
          <Icon
            name="calendar-remove"
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

export default memo(UsersList);
