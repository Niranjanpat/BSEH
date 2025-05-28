import {StyleSheet, View} from 'react-native';
import React, {memo, useState} from 'react';
import {Divider, IconButton, Menu} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {
  storeRetailerFilterData,
  storeRetailerFilterSelectedMenu,
  storeShowRetailerFilter,
} from '../../store/actions/retailer';

const RetailerMasterFilterMenu = () => {
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleShowRetailerFilter = menu => {
    dispatch(storeRetailerFilterSelectedMenu(menu));
    dispatch(storeShowRetailerFilter(true));
    setVisible(false);
  };

  const handleStatusRetailerFilter = menu => {
    dispatch(storeRetailerFilterSelectedMenu(menu));
    setVisible(false);
  };

  const handleClearRetailerFilter = () => {
    const data = {
      type_id: '',
      class_id: '',
      status: '',
    };
    setVisible(false);
    dispatch(storeRetailerFilterData(data));
    dispatch(storeRetailerFilterSelectedMenu(''));
  };

  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<IconButton icon="filter-outline" size={20} style={{margin: 0}} onPress={openMenu} />}>
        <Menu.Item
          onPress={() => {
            handleShowRetailerFilter('Type');
          }}
          title="Customer Types"
        />
        <Menu.Item
          onPress={() => handleShowRetailerFilter('Class')}
          title="Customer Classes"
        />
        <Divider />
        <Menu.Item
          onPress={() => handleStatusRetailerFilter('Active')}
          title="Active Customers"
        />
        <Menu.Item
          onPress={() => handleStatusRetailerFilter('Inactive')}
          title="Inactive Customers"
        />
        <Divider />
        <Menu.Item
          onPress={() => handleClearRetailerFilter()}
          title="Clear Filter"
        />
      </Menu>
    </View>
  );
};

export default memo(RetailerMasterFilterMenu);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
