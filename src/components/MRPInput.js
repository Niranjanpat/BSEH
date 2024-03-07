import {Text} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

import {SPACINGS} from '../constants/theme';
import {FONTS} from '../constants/theme/fonts';
import {COLORS} from '../constants/theme/colors';

import {updateItemToCart} from '../store/actions/returns';
import {getProductIfExists} from '../utils/return_cart';

const MRPInput = ({data}) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);

  useEffect(() => {
    getProductIfExists(data._id)
      .then(item => {
        if (item) setValue(item.mrp);
      })
      .catch(error => console.log('getProductIfExists', error));
  }, []);

  const onValueChange = val => {
    const mrp = parseInt(val);

    if (mrp > 0) {
      const item = {...data, mrp};

      dispatch(updateItemToCart(item));
      setValue(mrp);
      return;
    }

    const item = {...data, mrp: 0};
    dispatch(updateItemToCart(item));
    setValue(0);
  };

  return (
    <View style={styles.container}>
      <Text>MRP: </Text>
      <TextInput
        value={value.toString()}
        placeholder="MRP"
        onChangeText={onValueChange}
        keyboardType="number-pad"
        style={styles.input}
      />
    </View>
  );
};

export default MRPInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },

  input: {
    flex: 1,
    borderRadius: 10,
    textAlign: 'center',
    borderBottomWidth: 0.5,
    fontFamily: FONTS.regular,
    marginHorizontal: SPACINGS.xs,
    backgroundColor: COLORS.background,
  },
});
