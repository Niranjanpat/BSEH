import {StyleSheet, Image, View} from 'react-native';
import React, {
  useEffect,
} from 'react';
import {launchCamera} from 'react-native-image-picker';
import {Button} from 'react-native-paper';
import {COLORS} from '../constants/theme/colors';
import {requestCameraPermission} from '../utils/useCameraPermission';

const CameraModal =({setImage,image}) => {

  console.log("cameramodal",image);
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
        }
      },
    );
  };

  return (
    <View style={styles.container}>
      {!image ? (
        <Button
          mode="contained"
          onPress={() => {
            openCamera();
          }}
          style={styles.closeButton}>
          Take Odometer Photo
        </Button>
      ) : (
        <>
          <View style={{alignItems: 'center'}}>
            <Image
              source={{uri: image}}
              style={styles.imagePreview}
              textColor="black"
            />
          </View>
          <Button
            mode="contained"
            onPress={() => {
              openCamera();
            }}
            style={styles.closeButton}>
            Retake Odometer Photo
          </Button>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  closeButton: {
    color: COLORS.primary,
    alignContent: 'center',
  },
  imagePreview: {
    width: 250,
    height: 250,
    marginVertical: 20,
    borderRadius: 10,
  },
});

export default CameraModal;
