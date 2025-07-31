import {StyleSheet, Image} from 'react-native';
import React, {useState, forwardRef, useImperativeHandle} from 'react';
import {Modal, Button, Portal, Subheading} from 'react-native-paper';
import {COLORS} from '../constants/theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ExpenseImageModal = forwardRef(({item}, ref) => {
  const [visible, setImageVisible] = useState(false);
  const [imageError, setImageError] = useState(false);


  const hideModal = () => {
    setImageVisible(false);
  };

  useImperativeHandle(ref, () => ({
    showImage(newState) {
      setImageVisible(newState);
    },
  }));

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.modalContainer}>
        <Subheading style={{fontWeight: 'bold'}}>{item.expense_type?.toString()?.toUpperCase()}</Subheading>
        {!imageError && item?.photo_path ? (
          <Image
            resizeMode='stretch'
            source={{uri: item.photo_path}}
            style={styles.largeImage}
            onError={() => setImageError(true)}></Image>
        ) : (
          <Icon name="image-off-outline" size={250} color={COLORS.lightGrey} />
        )}
        <Button mode="contained" onPress={hideModal} style={styles.closeButton}>
          Close
        </Button>
      </Modal>
    </Portal>
  );
});

const styles = StyleSheet.create({

    largeImage: {
    height: 300,
    width: 300,
    borderRadius: 10,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    gap: 10,
    alignItems: 'center',
  },
  closeButton: {
    color: COLORS.primary,
    alignContent: 'center',
  },

});

export default ExpenseImageModal;
