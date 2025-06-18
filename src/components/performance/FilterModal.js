import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import React, {memo, useEffect, useState} from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {MultiSelect} from 'react-native-element-dropdown';
import {Button, Dialog, Portal, TextInput, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../../constants/theme/colors';
import usePerformance from '../../hooks/usePerformance';

const {height} = Dimensions.get('window');

const FilterModal = ({
  visible,
  startDate,
  endDate,
  selectedUsers,
  onStarDateChange,
  onEndDateChange,
  onUserSelect,
  onOkClick,
  userData,
  onCancelClick,
}) => {
  const {users, fetchSubordinates} = usePerformance();

  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  useEffect(() => {
    if (userData == null) {
      fetchSubordinates();
    }
  }, []);

  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.name}</Text>
        <Icon style={styles.icon} color="black" name="account" size={20} />
      </View>
    );
  };

  return (
    <Portal>
      <Dialog visible={visible} dismissable={false} style={styles.container}>
        <Dialog.Title>Filter</Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView showsVerticalScrollIndicator={false}>
            <MultiSelect
              mode="modal"
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={userData ? userData : users}
              labelField="name"
              valueField="_id"
              placeholder="Select users"
              value={selectedUsers}
              search
              searchPlaceholder="Search..."
              onChange={item => onUserSelect(item)}
              renderLeftIcon={() => (
                <Icon
                  style={styles.icon}
                  color="black"
                  name="account"
                  size={20}
                />
              )}
              renderItem={renderItem}
              renderSelectedItem={(item, unSelect) => (
                <Pressable onPress={() => unSelect && unSelect(item)}>
                  <View style={styles.selectedStyle}>
                    <Text style={styles.textSelectedStyle}>{item.name}</Text>
                    <Icon color="black" name="delete" size={17} />
                  </View>
                </Pressable>
              )}
            />
            <Pressable onPress={() => setStartDateOpen(true)}>
              <TextInput
                value={dayjs(startDate).format('DD MMMM YYYY')}
                label="Start Date"
                editable={false}
                style={styles.input}
              />
            </Pressable>
            <Pressable onPress={() => setEndDateOpen(true)}>
              <TextInput
                value={dayjs(endDate).format('DD MMMM YYYY')}
                label="End Date"
                editable={false}
                style={styles.input}
              />
            </Pressable>

            {startDateOpen && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="calendar"
                maximumDate={new Date()}
                onChange={(_, date) => {
                  setStartDateOpen(false);
                  onStarDateChange(date);
                }}
              />
            )}
            {endDateOpen && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="calendar"
                maximumDate={new Date()}
                onChange={(_, date) => {
                  setEndDateOpen(false);
                  onEndDateChange(date);
                }}
              />
            )}
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={onCancelClick}>Cancel</Button>
          <Button onPress={onOkClick}>Ok</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.light,
    maxHeight: 0.8 * height,
  },
  input: {
    backgroundColor: COLORS.light,
    marginVertical: 10,
  },
  dropdown: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    marginVertical: 10,
    elevation: 2,
    marginHorizontal: 3,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'white',
    shadowColor: '#000',
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
  },
});

export default memo(FilterModal);
