import {StyleSheet, View} from 'react-native';
import React, { memo } from 'react';
import {Caption, List, Text} from 'react-native-paper';
import PromotionalQuantity from './PromotionalQuantity';

const PromotionalItem = ({item}) => {
  return (
    <List.Item
      style={styles.list}
      titleStyle={{fontWeight: 'bold'}}
      titleNumberOfLines={10}
      title={item.promotional_item_name}
      descriptionStyle={{flex: 1}}
      description={_ => (
        <>
          <Caption>
            {item.promotional_item_sap_code
              ? item.promotional_item_sap_code
              : 'N/A'}
          </Caption>
          <View style={{flex: 1}} />
          <Text>Quantity : {item.quantity ? item.quantity : 'N/A'}</Text>
        </>
      )}
      right={_ => (
        <View style={styles.listRight}>
          <PromotionalQuantity data={item} />
        </View>
      )}
    />
  );
};

export default memo(PromotionalItem);

const styles = StyleSheet.create({
  list: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },

  listRight: {
    width: '16%',
    alignItems: 'center',
  },
});
