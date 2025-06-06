import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {Button, Modal, Portal, ActivityIndicator} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {
  storeRetailerFilterData,
  storeShowRetailerFilter,
} from '../../store/actions/retailer';
import {useRetailerMaster} from '../../hooks/useRetailerMaster';
import {COLORS} from '../../constants/theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
        dispatch(storeRetailerFilterData({...retailerFilterData, status: true}));
        break;
      case 'Inactive':
        dispatch(storeRetailerFilterData({...retailerFilterData, status: false}));
        break;
    }
  }, [selectedRetailerFilterMenu]);

  useEffect(() => {
    if (showRetailerFilter) {
      const type = getFilterType(selectedRetailerFilterMenu);
      if (type === '') return;
      setSelectedValue(retailerFilterData[type]);
    }
  }, [showRetailerFilter, retailerFilterData]);

  const closeModal = () => dispatch(storeShowRetailerFilter(false));

  const setSelectedCustomerValue = useCallback(
    value => {
      closeModal();
      const type = getFilterType(selectedRetailerFilterMenu);
      if (type === '') return;
      dispatch(storeRetailerFilterData({...retailerFilterData, [type]: value}));
    },
    [selectedRetailerFilterMenu],
  );

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
        return '';
    }
  };

  const renderItem = ({item}) => {
    const isSelected = item._id === selectedValue;
    return (
      <TouchableOpacity
        style={[styles.optionContainer, isSelected && styles.selected]}
        onPress={() => setSelectedCustomerValue(item._id)}>
        <View style={[styles.radioCircle, isSelected && styles.radioSelected]}>
          {isSelected && <View style={styles.radioDot} />}
        </View>
        <Icon
          name="account-outline"
          size={20}
          color={isSelected ? COLORS.primary : '#555'}
          style={styles.icon}
        />
        <Text style={styles.optionText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={closeModal} contentContainerStyle={styles.modalContainer}>
        <Text style={styles.title}>Select Customer {selectedRetailerFilterMenu}</Text>

        <TouchableOpacity
          style={[styles.optionContainer, selectedValue === '' && styles.selected]}
          onPress={() => setSelectedCustomerValue('')}>
          <View style={[styles.radioCircle, selectedValue === '' && styles.radioSelected]}>
            {selectedValue === '' && <View style={styles.radioDot} />}
          </View>
          <Icon name="select-all" size={20} color="#555" style={styles.icon} />
          <Text style={styles.optionText}>All {selectedRetailerFilterMenu}</Text>
        </TouchableOpacity>

        <View style={{maxHeight: 250}}>
          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : (
            <FlatList
              data={data}
              keyExtractor={item => item._id}
              renderItem={renderItem}
              contentContainerStyle={{paddingBottom: 25}}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.centered}>
                  <Icon name="close-box-outline" size={32} color="#999" />
                  <Text style={styles.emptyText}>
                    No {selectedRetailerFilterMenu} found
                  </Text>
                </View>
              }
            />
          )}
        </View>

        <Button mode="contained" onPress={closeModal} style={styles.submitButton}>
          Done
        </Button>
      </Modal>
    </Portal>
  );
};

export default memo(RetailerMasterFilterModal);

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.primary,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  selected: {
    backgroundColor: '#f0f4ff',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioSelected: {
    borderColor: COLORS.primary,
  },
  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  icon: {
    marginRight: 8,
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  centered: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: '#666',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
  },
});
