import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Image,
  Text,
  ScrollView,
  Alert,
  Pressable,
} from 'react-native';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-date-picker';
import Geolocation from 'react-native-geolocation-service';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import dayjs from 'dayjs';

import {COLORS} from '../constants/theme/colors';
import MyDropdown from '../components/DropDown';
import {requestCameraPermission} from '../utils/useCameraPermission';
import {getExpenseType, addExpense, updateExpense} from '../services/expense_sevice';

const AddExpensesScreen = ({route, navigation}) => {
  const {channel, expenseDetail, id} = route.params;

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [extra, setExtra] = useState('');
  const [expenseTypeSelected, setExpenseTypeSelected] = useState(null);
  const [details, setDetails] = useState('');
  const [image, setImage] = useState(null);
  const [expenseType, setExpenseType] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const latitude = useRef(null);
  const longitude = useRef(null);

  useEffect(() => {
    const checkCameraPermission = async () => {
      const granted = await requestCameraPermission();
      if (!granted) {
        Alert.alert(
          'Camera permission denied',
          'Please enable camera permission in settings.',
        );
      }
    };
    checkCameraPermission();
    fetchExpenseTypes();
  }, []);

  useEffect(() => {
    if (channel === 'update' && expenseDetail) {
      const parsedDate = new Date(expenseDetail.date);
      setDate(!isNaN(parsedDate) ? parsedDate : new Date());
      setDetails(expenseDetail.details || '');
      setExtra(expenseDetail.extra || '');
      setAmount(expenseDetail.amount?.toString() || '');
      setExpenseTypeSelected(expenseDetail.expense_type || null);
      setImage(expenseDetail.photo_path || null);
    }
  }, [channel, expenseDetail]);

  const handleOpenCamera = () => {
    launchCamera(
      {mediaType: 'photo', cameraType: 'back', saveToPhotos: true},
      response => {
        if (response.didCancel) return;
        if (response.errorCode)
          return Alert.alert('Camera error', response.errorMessage);
        setImage(response.assets?.[0]?.uri);
      },
    );
  };

  const handleOpenGallery = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) return;
      if (response.errorCode)
        return Alert.alert('Gallery error', response.errorMessage);
      setImage(response.assets?.[0]?.uri);
    });
  };

  const resetForm = () => {
    setDate(new Date());
    setAmount('');
    setExtra('');
    setExpenseTypeSelected(null);
    setDetails('');
    setImage(null);
  };

  const onSubmit = () => {
    if (!amount || !details || !extra || !expenseTypeSelected || !image) {
      return Alert.alert(
        'Error',
        'Please fill in all fields and select an image.',
      );
    }

    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setIsLoading(true);

    Geolocation.getCurrentPosition(
      position => {
        latitude.current = position.coords.latitude;
        longitude.current = position.coords.longitude;

        const formData = new FormData();
        if (image) {
          formData.append('photo', {
            uri: image,
            type: 'image/jpeg',
            name: 'expense.jpeg',
          });
        }
        formData.append('date', formattedDate);
        formData.append('longitude', longitude.current);
        formData.append('latitude', latitude.current);
        formData.append('expense_type', expenseTypeSelected);
        formData.append('amount', amount);
        formData.append('details', details);
        formData.append('extra', extra);

        const handleResponse = (res) => {
          const {success, errors} = res.data;
          if (success) {
            Alert.alert('Success', `Expense ${channel === 'update' ? 'updated' : 'added'} successfully`);
            if (channel === 'add') resetForm();
            navigation.goBack();
          } else {
            console.log(errors);
            Alert.alert('Error', JSON.stringify(errors));
          }
        };

        const apiCall = channel === 'update'
          ? updateExpense(formData, id)
          : addExpense(formData);

        apiCall
          .then(handleResponse)
          .catch(err => console.log(err))
          .finally(() => setIsLoading(false));
      },
      error => {
        setIsLoading(false);
        Alert.alert('Location', 'Check if your location service is enabled.');
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const fetchExpenseTypes = async () => {
    try {
      const res = await getExpenseType();
      const {data, success, errors} = res?.data;
      if (success) {
        setExpenseType(data.expense_types);
      } else {
        console.log('Expense type error:', errors);
        Alert.alert('Error', JSON.stringify(errors));
      }
    } catch (error) {
      console.log('getExpenseTypes error:', error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.containerWrap}>
        <View style={styles.container}>
          <Pressable onPress={() => setOpen(true)}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              value={dayjs(date).format('DD MMMM YYYY')}
              editable={false}
              style={styles.input}
            />
          </Pressable>
          <DatePicker
            date={date}
            modal
            open={open}
            mode="date"
            onCancel={() => setOpen(false)}
            onConfirm={selectedDate => {
              setOpen(false);
              setDate(selectedDate);
            }}
          />
        </View>

        <MyDropdown
          selectedOption={expenseTypeSelected}
          channel="Expense Type"
          item={expenseType}
          setSelectedOption={setExpenseTypeSelected}
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
            style={[styles.input, {height: 150, textAlignVertical: 'top'}]}
            placeholder="Details"
            placeholderTextColor="#888"
            multiline
            value={details}
            onChangeText={setDetails}
          />
        </View>

        <View style={styles.container}>
          <Text style={styles.label}>Extra</Text>
          <TextInput
            style={styles.input}
            placeholder="Extra"
            placeholderTextColor="#888"
            value={extra}
            onChangeText={setExtra}
          />
        </View>

        <View style={styles.container}>
          {image && <Image source={{uri: image}} style={styles.image} />}
          <View style={styles.imageButtonRow}>
            <Button
              mode="contained"
              onPress={handleOpenCamera}
              icon={() => <Icon name="photo-camera" size={20} color="#fff" />}
              style={styles.imageButton}
              contentStyle={styles.buttonContent}>
              Open Camera
            </Button>
            <Button
              mode="contained"
              onPress={handleOpenGallery}
              icon={() => <Icon name="photo-library" size={20} color="#fff" />}
              style={styles.imageButton}
              contentStyle={styles.buttonContent}>
              Pick from Gallery
            </Button>
          </View>
        </View>

        <View style={[styles.container, {marginBottom: 20}]}>
          <Button
            mode="contained"
            onPress={onSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={styles.submitButton}>
            Submit
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerWrap: {
    flexDirection: 'column',
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 5,
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
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    alignSelf: 'center',
  },
  imageButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
  },
  imageButton: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  buttonContent: {
    paddingVertical: 2,
    flexDirection: 'row-reverse',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
  },
});

export default AddExpensesScreen;
