import React from 'react';
import {useSelector} from 'react-redux';
import {Badge} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ROUTES} from '../constants/routes';

const ReturnCartIcon = () => {
  const navigation = useNavigation();
  const {returnItems} = useSelector(state => state.returns);

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => navigation.navigate(ROUTES.return_cart)}>
      {returnItems?.length > 0 ? (
        <Badge style={styles.badge}>{returnItems.length}</Badge>
      ) : null}
      <Icon name="cart-arrow-up" size={24} />
    </TouchableOpacity>
  );
};

export default ReturnCartIcon;

const styles = StyleSheet.create({
  badge: {
    top: -10,
    right: -10,
    position: 'absolute',
  },
});
