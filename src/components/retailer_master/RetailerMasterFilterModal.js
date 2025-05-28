import {FlatList, StyleSheet, View} from 'react-native';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  Dialog,
  Modal,
  Portal,
  RadioButton,
  Text,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {
  storeRetailerFilterData,
  storeShowRetailerFilter,
} from '../../store/actions/retailer';
import {useRetailerMaster} from '../../hooks/useRetailerMaster';

const RetailerMasterFilterModal = () => {
  const {showRetailerFilter, selectedRetailerFilterMenu, retailerFilterData} =
    useSelector(state => state.retailer);

  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  const {data, loading, setFilter} = useRetailerMaster();

  useEffect(() => {
    setVisible(showRetailerFilter);
    if (!showRetailerFilter) return;
    setFilter(selectedRetailerFilterMenu);
  }, [showRetailerFilter, selectedRetailerFilterMenu]);

  useEffect(() => {
    switch (selectedRetailerFilterMenu) {
      case 'Active':
        const filterDataActive = {
          ...retailerFilterData,
          status: true,
        };
        dispatch(storeRetailerFilterData(filterDataActive));
        break;
      case 'Inactive':
        const filterDataInactive = {
          ...retailerFilterData,
          status: false,
        };
        dispatch(storeRetailerFilterData(filterDataInactive));
        break;
      default:
        console.log('Invalid menu');
    }
  }, [selectedRetailerFilterMenu]);

  useEffect(() => {
    if (showRetailerFilter) {
      const type = getFilterType(selectedRetailerFilterMenu);
      if (type === '') return;
      setSelectedValue(retailerFilterData[type]);
    }
  }, [showRetailerFilter, retailerFilterData]);

  const closeDialog = () => dispatch(storeShowRetailerFilter(false));

  const setSelectedCustomerValue = useCallback(value => {
    closeDialog();
    const type = getFilterType(selectedRetailerFilterMenu);
    if (type === '') return;
    const filterData = {
      ...retailerFilterData,
      [type]: value,
    };
    dispatch(storeRetailerFilterData(filterData));
  }, [selectedRetailerFilterMenu]);

  const getFilterType = menu => {
    switch (menu) {
      case 'Type':
        return 'type_id';
      case 'Class':
        return 'class_id';
      case 'Active':
      case 'Inactive':
        return 'status';
      default:
        console.log('Invalid menu');
        return '';
    }
  };

  return (
    <Portal>
      <Dialog
        visible={visible}
        style={styles.container}
        onDismiss={() => closeDialog()}>
        <Dialog.Title>{`Select Customer ${selectedRetailerFilterMenu}`}</Dialog.Title>
        <Dialog.Content style={[styles.container]}>
          <RadioButton.Group
            onValueChange={(v) => setSelectedCustomerValue(v)}
            value={selectedValue}>
            <RadioButton.Item
              label={`All ${selectedRetailerFilterMenu}`}
              value=""
            />
            <View style={{height: 235}}>
              <FlatList
                data={data}
                keyExtractor={(item, _) => item._id}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={false}
                scrollEnabled={true}
                ListHeaderComponent={loading && <ActivityIndicator />}
                ListEmptyComponent={
                  !loading && (
                    <Text
                      style={{
                        alignSelf: 'center',
                      }}>{`No ${selectedRetailerFilterMenu}`}</Text>
                  )
                }
                renderItem={({item}) => {
                  return (
                    <RadioButton.Item label={item.name} value={item._id} />
                  );
                }}
              />
            </View>
          </RadioButton.Group>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => closeDialog()}>Done</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default memo(RetailerMasterFilterModal);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
