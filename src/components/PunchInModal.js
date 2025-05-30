import {StyleSheet, View, ScrollView, Text, TextInput} from 'react-native';
import React, {forwardRef, useState, useImperativeHandle} from 'react';
import {Modal, Button, Portal} from 'react-native-paper';
import {COLORS} from '../constants/theme/colors';
import MyDropdown from './DropDown';
import CameraModal from './CameraModal';
import usePunchInModal from '../hooks/usePunchInModal';

const PunchInModalUI = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const hideModal = () => setVisible(false);
  const showModal = () => setVisible(true);

  useImperativeHandle(ref, () => ({
    showPunchIn: showModal,
  }));

  const {
    startKm,
    setStartKm,
    image,
    setImage,
    vehicleTypeSelected,
    setVehicleTypeSelected,
    workTypeSelected,
    setWorkTypeSelected,
    workType,
    vehicleType,
    onSubmit,
    remark,
    setRemark,
  } = usePunchInModal();

  const isRemarkField =
    vehicleTypeSelected === 'public-transport' ||
    vehicleTypeSelected === 'others-enter-tada-remarks';

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.modalContainer}>
        <View style={{marginBottom: 20, marginTop: 20}}>
          <ScrollView>
            <MyDropdown
              selectedOption={workTypeSelected}
              channel="Work Type"
              item={workType}
              setSelectedOption={setWorkTypeSelected}
            />
            <MyDropdown
              selectedOption={vehicleTypeSelected}
              channel="Vehicle Type"
              setSelectedOption={setVehicleTypeSelected}
              item={vehicleType}
            />
            <View style={styles.container}>
              <Text style={styles.label}>
                {isRemarkField ? 'Enter Remarks' : 'Enter Start Vehicle KM'}
              </Text>
              {isRemarkField ? (
                <TextInput
                  style={styles.input}
                  placeholder={'Enter Remarks'}
                  placeholderTextColor="#888"
                  value={remark}
                  onChangeText={setRemark}
                />
              ) : (
                <TextInput
                  style={styles.input}
                  placeholder={'Enter Start Vehicle KM'}
                  placeholderTextColor="#888"
                  keyboardType={'numeric'}
                  value={startKm}
                  onChangeText={setStartKm}
                />
              )}
            </View>
            {!isRemarkField && (
              <CameraModal setImage={setImage} image={image} />
            )}
          </ScrollView>
          <Button
            mode="contained"
            onPress={() => {
              onSubmit(isRemarkField);
              hideModal();
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

export default PunchInModalUI;
