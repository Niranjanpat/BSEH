import {View} from 'react-native';
import React from 'react';
import RetailerMasterFilterModal from './RetailerMasterFilterModal';
import RetailerMasterFilterMenu from './RetailerMasterFilterMenu';

const RetailerMasterFilter = () => {
  return (
    <View>
      <RetailerMasterFilterMenu />
      <RetailerMasterFilterModal />
    </View>
  );
};

export default RetailerMasterFilter;
