import {StyleSheet, View, FlatList, Text, TouchableOpacity} from 'react-native';
import React, {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle,
} from 'react';
import {Modal, Button, Portal} from 'react-native-paper';
import {COLORS} from '../constants/theme/colors';
import useLocationPermission from '../utils/useLocationPermission';
import {useAttendance} from '../hooks/useAttendance';

const ListModal = forwardRef(({channel, setSelection}, ref) => {
  const {data, loading, getAbsentReasons, getPresentReasons, onSubmit} =
    useAttendance();
  const [visible, setListVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [requestLocationPermission] = useLocationPermission();

  useEffect(() => {
    requestLocationPermission();
    channel == 'Present' ? getPresentReasons() : getAbsentReasons();
  }, []);

  const hideModal = () => {
    setListVisible(false);
  };

  useImperativeHandle(ref, () => ({
    showList(newState) {
      setListVisible(newState);
    },
  }));

  const toggleOption = option => {
    if (selectedOption === option) {
      setSelectedOption(null); // Deselect if same option is tapped
    } else {
      setSelectedOption(option); // Select new option
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.modalContainer}>
        <View>
          <FlatList
            data={data}
            renderItem={({item}) => {
              const isSelected = item._id === selectedOption;
              return (
                <TouchableOpacity
                  style={styles.optionContainer}
                  onPress={() => toggleOption(item._id)}>
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.selectedRadio,
                    ]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.optionText}>{item.text}</Text>
                </TouchableOpacity>
              );
            }}
            keyExtractor={item => item._id}
          />
          <Button
            mode="contained"
            onPress={() => {
              onSubmit(hideModal, channel, setSelection, selectedOption);
            }}
            disabled={loading}
            loading={loading}
            style={styles.closeButton}>
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
  },
  closeButton: {
    color: COLORS.primary,
    alignContent: 'center',
    marginTop: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedRadio: {
    borderColor: COLORS.primary,
  },
  radioDot: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  optionText: {
    fontSize: 16,
    color: 'black',
  },
  selectedText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default ListModal;
