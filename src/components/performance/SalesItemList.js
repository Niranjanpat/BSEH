import {View, StyleSheet, Pressable} from 'react-native';
import React, {memo, useState} from 'react';
import {Caption, Divider, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../../constants/theme/colors';

const SalesItemList = ({item}) => {
  const [expand, setExpand] = useState(false);

  return (
    <>
      <View style={styles.subRow}>
        <View style={styles.left}>
          <Text numberOfLines={2} style={styles.text}>
            {item.name}
          </Text>
          <Caption>{item.sap_code}</Caption>
        </View>
        <View style={styles.mid}>
          <Text>{item.quantity}</Text>
        </View>
        <View style={styles.right}>
          <Text>{item.amount}</Text>
        </View>
      </View>
      {expand && (
        <View style={styles.footer}>
          <View style={styles.section}>
            <Caption>Quantity carton: {item.quantity_carton}</Caption>
          </View>
          <View style={styles.section}>
            <Caption>Weight: {item.weight}</Caption>
          </View>
          <View style={styles.section}>
            <Caption>Weight MT: {item.weight_mt}</Caption>
          </View>
        </View>
      )}
      <Pressable style={styles.footerBtn} onPress={() => setExpand(!expand)}>
        <Icon
          name={expand ? 'chevron-up' : 'chevron-down'}
          size={22}
          color={COLORS.lightGrey}
        />
      </Pressable>
      <Divider />
      <Divider />
      <Divider />
    </>
  );
};

const styles = StyleSheet.create({
  left: {
    flex: 5,
    justifyContent: 'center',
  },
  mid: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  footerBtn: {
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  section: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(SalesItemList);
