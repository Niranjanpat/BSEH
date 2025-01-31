import React, {useCallback, useMemo} from 'react';
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

  const navigateTo = useCallback(() => {
    const screen = cartItems?.length > 0 ? ROUTES.order_cart : ROUTES.order_checkout;
    navigation.navigate(screen);
  }, [cartItems])

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => navigateTo()}>
      <Badge style={styles.badge}>{cartItemCount}</Badge>
      <Icon name="cart-outline" size={24} style={{color:'black'}} />
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
