import {StyleSheet, View, ScrollView} from 'react-native';
import React, {forwardRef, useState, useImperativeHandle} from 'react';
import {Modal, Button, Portal, Text} from 'react-native-paper';
import {COLORS} from '../constants/theme/colors';
import MyDropdown from './DropDown';
import CameraModal from './CameraModal';
import usePunchInModal from '../hooks/usePunchInModal';
import InputText from './InputText';

const PunchInModalUI = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const hideModal = () => setVisible(false);
  const showModal = () => setVisible(true);

  useImperativeHandle(ref, () => ({
    showPunchIn: showModal,
  }));

  const {
    onKmChanged,
    onImageSelected,
    onVehicleTypeSelected,
    onWorkTypeSelected,
    workType,
    vehicleType,
    onSubmit,
    onRemarkChanged,
    isRemarkField,
  } = usePunchInModal();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.modalContainer}>
        <View style={{marginBottom: 0, marginTop: 0}}>
          <Text variant='titleLarge' style={styles.dialogTitle}>Punch In</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <MyDropdown
              onOptionChanged={onWorkTypeSelected}
              channel="Work Type"
              item={workType}
            />
            <MyDropdown
              onOptionChanged={onVehicleTypeSelected}
              channel="Vehicle Type"
              item={vehicleType}
            />
            <View style={styles.container}>
              <Text style={styles.label}>
              {isRemarkField ? 'Enter Remarks' : 'Enter Start Vehicle KM'}
            </Text>
            {isRemarkField ? (
              <InputText
                placeholder={'Enter Remarks'}
                onChangeText={onRemarkChanged}
              />
            ) : (
              <InputText
                placeholder={'Enter Start Vehicle KM'}
                keyboardType={'numeric'}
                onChangeText={onKmChanged}
              />
            )}
            {!isRemarkField && (
              <CameraModal onImageSelect={onImageSelected} />
            )}
            </View>
            
          </ScrollView>
          <Button
            mode="contained"
            onPress={() => {
              hideModal();
              onSubmit(isRemarkField);
            }}
            style={[styles.closeButton, {marginTop: 20}]}>
            Submit
          </Button>
        </View>
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
    gap: 10,
    maxHeight: '90%',
  },
  closeButton: {
    color: COLORS.primary,
    alignContent: 'center',
  },
  container: {
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: 'bold',
  },
  dialogTitle: {alignSelf: 'center', marginBottom: 10,},
});

export default PunchInModalUI;
