import {useFocusEffect} from '@react-navigation/core';
import React, {useEffect, memo, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Subheading, Avatar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS} from '../constants/theme/colors';
import {getTodaysOrder} from '../store/actions/performance';
const TodayOrder = ({self}) => {
  const dispatch = useDispatch();
  const {todaysOrder} = useSelector(state => state.performance);
  useFocusEffect(
    useCallback(() => {
      dispatch(getTodaysOrder({self}));
    }, []),
  );

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Avatar.Icon
          size={35}
          style={styles.avatar}
          icon="cart"
          color="white"
        />
        <Subheading style={styles.heading}>Today's Order</Subheading>
      </View>
      <View style={styles.mainBox}>
        <View style={styles.contain}>
          <Text>
            <Icon name="cart-outline" color={COLORS.primary} size={20} /> Total
            Order
          </Text>
          <Subheading> {todaysOrder.quantity}</Subheading>
        </View>
        <View style={styles.contain}>
          <Text>
            <Icon name="cash" color={COLORS.primary} size={20} /> Total Amount
          </Text>
          <Subheading>₹ {todaysOrder.amount}</Subheading>
        </View>
      </View>
    </View>
  );
};

export default memo(TodayOrder);

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    marginBottom: 5,
    padding: 10,
    elevation: 3,
    backgroundColor: COLORS.light,
    marginHorizontal: 2,
    borderRadius: 10,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },

  heading: {
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },

  avatar: {
    backgroundColor: COLORS.primary,
  },

  mainBox: {
    flex: 1,
    flexDirection: 'row',
  },

  contain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
