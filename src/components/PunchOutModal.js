// components/PunchOutModalUI.js

import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Text,
} from 'react-native';
import React, {forwardRef, useState, useImperativeHandle} from 'react';
import {Modal, Button, Portal} from 'react-native-paper';
import {COLORS} from '../constants/theme/colors';
import MyDropdown from './DropDown';
import CameraModal from './CameraModal';
import usePunchOutModal from '../hooks/usePunchOutModal';

const PunchOutModalUI = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const hideModal = () => setVisible(false);
  const showModal = () => setVisible(true);

  useImperativeHandle(ref, () => ({
    showPunchOut: showModal,
  }));

  const {
    workFeedback,
    setWorkFeedback,
    dayEndDetail,
    setDayEndDetail,
    vehicleReading,
    setVehicleReading,
    totalVehicleReading,
    setTotalVehicleReading,
    dailyAllowance,
    dailyAllowanceSelected,
    setDailyAllowanceSelected,
    image,
    setImage,
    onSubmit,
  } = usePunchOutModal(hideModal);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.modalContainer}>
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.label}>Work feedback</Text>
            <TextInput
              style={styles.input}
              placeholder="Work feedback"
              placeholderTextColor="#888"
              value={workFeedback}
              onChangeText={setWorkFeedback}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>Day end details</Text>
            <TextInput
              style={styles.input}
              placeholder="Day end details"
              placeholderTextColor="#888"
              value={dayEndDetail}
              onChangeText={setDayEndDetail}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>Day End Vehicle K.M</Text>
            <TextInput
              style={styles.input}
              placeholder="Day End Vehicle K.M"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={vehicleReading}
              onChangeText={setVehicleReading}
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>Total K.M.</Text>
            <TextInput
              style={styles.input}
              placeholder="Total K.M."
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={totalVehicleReading}
              onChangeText={setTotalVehicleReading}
            />
          </View>

          <MyDropdown
            selectedOption={dailyAllowanceSelected}
            channel="Daily Allowance"
            item={dailyAllowance}
            setSelectedOption={setDailyAllowanceSelected}
          />

          <CameraModal setImage={setImage} image={image} />
        </ScrollView>

        <Button
          mode="contained"
          onPress={onSubmit}
          style={styles.closeButton}>
          Submit
        </Button>
      </Modal>
    </Portal>
  );
});

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    maxHeight: '90%',
    gap: 10,
  },
  closeButton: {
    color: COLORS.primary,
    margin: 20,
  },
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#f9f9f9',
  },
});

export default PunchOutModalUI;
