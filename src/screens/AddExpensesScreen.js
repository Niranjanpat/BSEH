import {
  StyleSheet,
  View,
  TextInput,
  Image,
  Text,
  ScrollView,
  Alert,
  Pressable
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button} from 'react-native-paper';
import {COLORS} from '../constants/theme/colors';
import MyDropdown from '../components/DropDown';
import DatePicker from 'react-native-date-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {requestCameraPermission} from '../utils/useCameraPermission';
import dayjs from 'dayjs';

const AddExpensesScreen = () => {

  useEffect(() => { 
    const checkCameraPermission = async () => {
      const granted = await requestCameraPermission();
      if (granted) {
        console.log('Camera permission granted');
      } else {
        Alert.alert('Camera permission denied', 'Please enable camera permission in settings.');
      }
    };
    checkCameraPermission();
  }, []); 


  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [extra, setExtra] = useState('');
  const [expireTypeSelected, setExpireTypeSelected] = useState(null);
  const [details, setDetails] = useState('');
  const [image, setImage] = useState(null);
  const expireType = [];

  const onSubmit = () => {
    if (!amount || !details || !extra) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!expireTypeSelected) {
      Alert.alert('Error', 'Please select an expire type');
      return;
    }

    if (!image) {
      Alert.alert('Error', 'Please select an image');
      return;
    }

    const data = {
      date: date.toISOString(),
      amount: parseFloat(amount),
      details,
      extra,
      expireType: expireTypeSelected,
      imageUri: image,
    };
    console.log('Submitted Data:', data);

  };

  const handleOpenCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        saveToPhotos: true,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled camera');
        } else if (response.errorCode) {
          Alert.alert('Camera error', response.errorMessage);
        } else {
          setImage(response.assets[0].uri);
        }
      },
    );
  };

  const handleOpenGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          Alert.alert('Gallery error', response.errorMessage);
        } else {
          setImage(response.assets[0].uri);
        }
      },
    );
  };

  return (
    <ScrollView>
      <View style={{flexDirction:'column',gap:10}}>
      <View style={styles.container}>
        <Pressable onPress={() => setOpen(true)}>  
        <Text style={styles.label}>Date</Text>
        <TextInput
          value={dayjs(date).format('DD MMMM YYYY')}
          editable={false}
          style={styles.input}
          label="Date"
        />
      </Pressable>
      <DatePicker
        date={date}
        modal
        open={open}
        mode="date"
        onCancel={() => setOpen(false)}
        onConfirm={date => {
          setOpen(false);
          setDate(date);
        }}
      />
      </View>
       
        <MyDropdown
          selectedOption={expireTypeSelected}
          channel="Expire Type"
          item={expireType}
          setSelectedOption={setExpireTypeSelected}
        />

        <View style={styles.container}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <View style={styles.container}>
          <Text style={styles.label}>Details</Text>
          <TextInput
            style={[styles.input,{height: 150, textAlignVertical: 'top'}]}
            placeholder="Details"
            placeholderTextColor="#888"
            keyboardType="text"
            value={details}
            multiline={true}
            onChangeText={setDetails}
          />
        </View>

        <View style={styles.container}>
          <Text style={styles.label}>Extra</Text>
          <TextInput
            style={styles.input}
            placeholder="Extra"
            placeholderTextColor="#888"
            keyboardType="text"
            value={extra}
            onChangeText={setExtra}
          />
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
         <Button mode="contained" onPress={handleOpenCamera} style={styles.closeButton}>
          Open Camera
        </Button>
          <View style={{height: 10}} />
           <Button mode="contained" onPress={handleOpenGallery} style={styles.closeButton}>
          Pick from Gallery
        </Button>
          {image && (
            <Image
              source={{uri: image}}
              style={{width: 200, height: 200, marginTop: 20, borderRadius: 10}  }
            />
          )}
        </View>
        <Button mode="contained" onPress={onSubmit} style={styles.closeButton}>
          Submit
        </Button>
      </View>
    </ScrollView>
  );
};

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
   inputDate: {
    marginVertical: 10,
    backgroundColor: COLORS.light,
    borderRadius: 8,
    borderColor: '#aaa',
    borderWidth: 1,
  },
});

export default AddExpensesScreen;
