import React, {useMemo} from 'react';
import {useSelector} from 'react-redux';
import {Badge} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ROUTES} from '../constants/routes';

const OrderCartIcon = () => {
  const navigation = useNavigation();
  const cartItems = useSelector(state => state.cart);
  const cartPromotionalItems = useSelector(state => state.cartPromotional);

  const cartItemCount = useMemo(
    () => (cartItems?.length || 0) + (cartPromotionalItems?.length || 0),
    [cartItems, cartPromotionalItems],
  );

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => navigation.navigate(ROUTES.order_cart)}>
      <Badge style={styles.badge}>{cartItemCount}</Badge>
      <Icon name="cart-outline" size={24} />
    </TouchableOpacity>
  );
};

export default OrderCartIcon;

const styles = StyleSheet.create({
  badge: {
    top: -10,
    right: -10,
    position: 'absolute',
  },
});
