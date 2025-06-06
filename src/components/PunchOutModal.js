// components/PunchOutModalUI.js

import {StyleSheet, View, TextInput, ScrollView} from 'react-native';
import React, {forwardRef, useState, useImperativeHandle} from 'react';
import {Modal, Button, Portal, Text} from 'react-native-paper';
import {COLORS} from '../constants/theme/colors';
import MyDropdown from './DropDown';
import CameraModal from './CameraModal';
import usePunchOutModal from '../hooks/usePunchOutModal';
import InputText from './InputText';
import {useSelector} from 'react-redux';

const PunchOutModalUI = forwardRef((props, ref) => {
  const {kilomerters} = useSelector(state => state.auth);
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
    onVehicleReadingChange,
    totalVehicleReading,
    dailyAllowance,
    setDailyAllowanceSelected,
    image,
    setImage,
    onSubmit,
  } = usePunchOutModal();

  const isRemarkField =
    kilomerters?.vehicleType === 'public-transport' ||
    kilomerters?.vehicleType === 'others-enter-tada-remarks';

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.modalContainer}>
        <Text variant="titleLarge" style={styles.dialogTitle}>
          Punch Out
        </Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.label}>Work feedback</Text>
          <InputText
            placeholder="Work feedback"
            onChangeText={setWorkFeedback}
          />
          <View style={styles.container} />
          <Text style={styles.label}>Day end details</Text>
          <InputText
            placeholder="Day end details"
            onChangeText={setDayEndDetail}
          />
          {!isRemarkField && (
            <>
              <View style={styles.container} />
              <Text style={styles.label}>
                Day End Vehicle K.M (Start KMs: {kilomerters?.startVehicleKm})
              </Text>
              <InputText
                placeholder="Day End Vehicle K.M"
                keyboardType="numeric"
                onChangeText={v =>
                  onVehicleReadingChange(v, kilomerters?.startVehicleKm)
                }
              />
              <Text variant="labelSmall" style={{alignSelf: 'flex-end'}}>
                Total K.M.: {totalVehicleReading.current}
              </Text>
            </>
          )}
          <View style={styles.container} />
          <MyDropdown
            channel="Daily Allowance"
            item={dailyAllowance}
            onOptionChanged={setDailyAllowanceSelected}
          />
          {!isRemarkField && <CameraModal onImageSelect={setImage} />}
        </ScrollView>

        <Button
          mode="contained"
          onPress={() => {
            hideModal();
            onSubmit(isRemarkField);
          }}
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
    marginTop: 20,
  },
  container: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 2,
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
  dialogTitle: {alignSelf: 'center', marginBottom: 10},
});

export default PunchOutModalUI;
