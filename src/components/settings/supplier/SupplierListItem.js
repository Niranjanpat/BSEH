import { View } from 'react-native'
import React, { memo } from 'react'
import { Caption, List } from 'react-native-paper';
import { stylesSupplier } from '../../../screens/Settings/suppliers/styles/SupplierStyles';

const SupplierListItem = ({item, onPress}) => {
    return (
        <List.Item
          style={stylesSupplier.list}
          titleStyle={{fontWeight: 'bold'}}
          title={item.name}
          onPress={() => {
            onPress();
          }}
          description={props => (
            <>
              <Caption>{item.sap_code ? item.sap_code : 'N/A'}</Caption>
            </>
          )}
          right={props => (
            <List.Icon
              {...props}
              style={stylesSupplier.listRight}
              icon="chevron-right"
            />
          )}
        />
      );
}

export default memo(SupplierListItem);