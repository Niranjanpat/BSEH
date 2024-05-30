import React, {useState, useEffect, memo} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {IconButton} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {getProductIfExists, getPromotionalItemsIfExists} from '../../utils/order_cart';
import {removeItemFromCart, removeItemFromCartPromotional, updateItemToCart, updateItemToCartPromotional} from '../../store/actions/cart';
import { TYPOGRAPHY } from '../../constants/theme';
import { COLORS } from '../../constants/theme/colors';

const iconSize = 15;
const PromotionalQuantity = ({data}) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);

  useEffect(() => {
    getPromotionalItemsIfExists(data.id)
      .then(item => {
        if (item) setValue(item.cartQuantity);
      })
      .catch(error => console.log('getPromotionalIfExists', error));
  }, []);

  const add = () => {
    const quantity = parseInt(value) + 1;
    if (quantity <= data.quantity) {
      const item = {...data, cartQuantity: quantity};

      setValue(quantity);
      dispatch(updateItemToCartPromotional(item));
    }
  };

  const remove = () => {
    const quantity = parseInt(value) - 1;

    if (quantity === 0) {
      setValue(quantity);

      dispatch(removeItemFromCartPromotional(data.id));
    }

    if (quantity > 0) {
      const item = {...data, cartQuantity: quantity};

      setValue(quantity);
      dispatch(updateItemToCartPromotional(item));
    }
  };

  const onValueChange = value => {
    if (value !== null && value > 0) {
      const quantity = parseInt(value);
      if (quantity <= data.quantity) {
        const item = {...data, cartQuantity: quantity};

        setValue(quantity);
        dispatch(updateItemToCartPromotional(item));
      }
      return;
    }

    setValue(0);
    dispatch(removeItemFromCartPromotional(data.id));
  };

  return (
    <View style={styles.container}>
      <IconButton icon="plus" size={iconSize} onPress={add} />
      <TextInput
        style={styles.inputStyle}
        value={value.toString()}
        onChangeText={onValueChange}
        textAlignVertical="bottom"
        keyboardType="number-pad"
      />
      <IconButton icon="minus" size={iconSize} onPress={remove} />
    </View>
  );
};

export default memo(PromotionalQuantity);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
    alignSelf: 'center',
  },

  inputStyle: {
    textAlign: 'center',
    alignSelf: 'center',
    ...TYPOGRAPHY.body2,
    height: 35,
    fontSize: 12,
  },
});
