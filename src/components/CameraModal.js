import {StyleSheet, Image, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {launchCamera} from 'react-native-image-picker';
import {Button} from 'react-native-paper';
import {COLORS} from '../constants/theme/colors';
import {requestCameraPermission} from '../utils/useCameraPermission';

const CameraModal = ({buttonText = 'Odometer', onImageSelect}) => {
  const [image, setImage] = useState('');

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Cannot open camera without permission.',
      );
      return;
    }

    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        quality: 0.5,
        saveToPhotos: false,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled camera');
        } else if (response.errorCode) {
          console.error('Camera error:', response.errorMessage);
          Alert.alert('Camera Error', response.errorMessage);
        } else {
          const uri = response.assets[0].uri;
          setImage(uri);
          onImageSelect(uri);
        }
      },
    );
  };

  return (
    <View style={styles.container}>
      {!image ? (
        <Button
          mode="text"
          onPress={() => {
            openCamera();
          }}
          style={styles.closeButton}>
          Take {buttonText} Photo
        </Button>
      ) : (
        <>
          <Image
            source={{uri: image}}
            style={styles.imagePreview}
            textColor="black"
          />
          <Button
            mode="text"
            onPress={() => {
              openCamera();
            }}
            style={styles.closeButton}>
            Retake {buttonText} Photo
          </Button>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 250,
    marginVertical: 10,
    borderRadius: 10,
    borderColor: '#aaa',
    borderWidth: 1,
  },
  closeButton: {
    color: COLORS.primary,
    alignContent: 'center',
    position: 'absolute',
  },
  imagePreview: {
    width: '100%',
    height: 248,
    borderRadius: 8,
  },
});

export default CameraModal;
