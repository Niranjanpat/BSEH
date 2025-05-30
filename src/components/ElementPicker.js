import React from 'react';
import {StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../constants/theme/colors';

const ElementPicker = ({
  data = [],
  value = '_id',
  label = 'name',
  selectedValue,
  onValueSelect,
  iconName = 'briefcase',
  placeholder = 'Select',
  searchPlaceholder = 'Search by name',
  onChangeText = text => {},
  onClearPress,
  disabled = false,
  showSearch = true,
  isModal = true,
}) => {
  return (
    <>
      <Dropdown
        mode={isModal ? 'modal' : 'default'}
        style={[styles.dropdown]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        itemTextStyle={{color: 'black'}}
        data={data}
        search={showSearch}
        disable={disabled}
        maxHeight={300}
        labelField={label}
        valueField={value}
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        value={selectedValue}
        // onFocus={() => setIsFocus(true)}
        // onBlur={() => setIsFocus(false)}
        onChange={item => onValueSelect(item)}
        onChangeText={text => onChangeText(text)}
        renderLeftIcon={() => (
          <Icon
            style={styles.icon}
            color={COLORS.primary}
            name={iconName}
            size={20}
          />
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    marginVertical: 10,
    elevation: 3,
    shadowOffset: {height: 2, width: 1},
    shadowColor: '#565454',
    shadowOpacity: 0.3,
    backgroundColor: COLORS.light,
    padding: 10,
    marginHorizontal: 2,
    borderRadius: 10,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: COLORS.darkGrey,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: COLORS.onSurface,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default ElementPicker;
