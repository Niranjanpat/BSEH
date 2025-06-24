import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {Text} from 'react-native-paper';
import theme from '../constants/theme';
import { COLORS } from '../constants/theme/colors';

export const filterOptions = {
    All: '',
    Pending: 'pending',
    Approved: 'approved',
    Rejected: 'rejected',
  };

const TabFilter = ({initialValue, filterOptionsObject = filterOptions, onFilterChange}) => {
  const [status, setStatus] = useState(initialValue);

  const handleChangeFilter = value => {
    setStatus(value);
    onFilterChange(value);
  };

  return (
    <View style={styles.statusTabs}>
      {Object.keys(filterOptionsObject).map(s => (
        <TouchableOpacity
          key={s}
          style={[
            styles.statusTab,
            status === s && {backgroundColor: theme.colors.primary},
          ]}
          onPress={() => handleChangeFilter(s)}>
          <Text style={[status === s && {color: '#fff', fontWeight: 'bold'}]}>
            {s}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TabFilter;

const styles = StyleSheet.create({
  statusTabs: {
    marginTop: 12,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: COLORS.light,
  },
  statusTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
});
