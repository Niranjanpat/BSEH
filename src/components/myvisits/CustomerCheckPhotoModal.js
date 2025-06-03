import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  Button,
  Divider,
  Modal,
  Portal,
  Title,
} from 'react-native-paper';
import {SPACINGS} from '../../constants/theme';
import {COLORS} from '../../constants/theme/colors';
import CameraModal from '../CameraModal';

const CustomerCheckPhotoModal = ({
  visible,
  onClose = () => {},
  onImageSelected,
  onSubmit,
}) => {
  return (
    <Portal>
      <Modal
        contentContainerStyle={styles.dialog}
        visible={visible}
        onDismiss={() => onClose(false)}>
        <Title
          style={{
            textAlign: 'center',
          }}>
          Customer Photo
        </Title>
        <Divider style={{backgroundColor: COLORS.primary, height: 1}} />
        <CameraModal buttonText='' onImageSelect={onImageSelected} />
        <Button
          mode="contained"
          onPress={() => {
            onSubmit();
            onClose(false);
          }}
          style={[styles.closeButton, {marginTop: 20}]}>
          Check-In Now
        </Button>
      </Modal>
    </Portal>
  );
};

export default CustomerCheckPhotoModal;

const styles = StyleSheet.create({
  dialog: {
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
});
