import React, {useState, useEffect} from 'react';
import {StyleSheet, TextInput, View,useColorScheme} from 'react-native';
import {IconButton} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {COLORS} from '../constants/theme/colors';
import {TYPOGRAPHY} from '../constants/theme/';

import {getProductIfExists} from '../utils/order_cart';
import {removeItemFromCart, updateItemToCart} from '../store/actions/cart';

const iconSize = 15;
const ProductQuantity = ({data}) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);
  const theme=useColorScheme();

  useEffect(() => {
    getProductIfExists(data._id)
      .then(item => {
        if (item) setValue(item.quantity);
      })
      .catch(error => console.log('getProductIfExists', error));
  }, []);

  const add = () => {
    const quantity = parseInt(value) + 1;
    const item = {...data, quantity};

    setValue(quantity);
    dispatch(updateItemToCart(item));
  };

  const remove = () => {
    const quantity = parseInt(value) - 1;

    if (quantity === 0) {
      setValue(quantity);

      dispatch(removeItemFromCart(data._id));
    }

    if (quantity > 0) {
      const item = {...data, quantity};

      setValue(quantity);
      dispatch(updateItemToCart(item));
    }
  };

  const onValueChange = value => {
    if (value !== null && value > 0) {
      const quantity = parseInt(value);
      const item = {...data, quantity};

      setValue(quantity);
      dispatch(updateItemToCart(item));
      return;
    }

    setValue(0);
    dispatch(removeItemFromCart(data._id));
  };

  return (
    <View style={styles.container}>
      <IconButton icon="plus" size={iconSize} onPress={add} />
      <TextInput
        style={[{color:(theme=='dark')?'black':'black'},styles.inputStyle]}
        value={value.toString()}
        onChangeText={onValueChange}
        textAlignVertical="bottom"
        keyboardType="number-pad"
      />
      <IconButton icon="minus" size={iconSize} onPress={remove} />
    </View>
  );
};

export default ProductQuantity;

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
