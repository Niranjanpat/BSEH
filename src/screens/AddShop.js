// AddShop.js
import React, {useEffect, useState} from 'react';
import {
  PermissionsAndroid,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Platform,
  Image,
  Alert,
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Subheading,
  Text,
  TextInput,
} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import {Formik} from 'formik';
import Geolocation from 'react-native-geolocation-service';
import {launchCamera} from 'react-native-image-picker';
import ElementPicker from '../components/ElementPicker';

import {COLORS} from '../constants/theme/colors';
import {
  getBeatList,
  getCustomerClassList,
  getCustomerTypeList,
  getPinCodeList,
  addShop,
  getBeatDetail,
} from '../services/retailer_services';
import {requestCameraPermission} from '../utils/useCameraPermission';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

// Helper Picker Component
const FormPicker = ({label, selectedValue, items, onValueChange}) => (
  <View style={styles.picker}>
    <Picker selectedValue={selectedValue} onValueChange={onValueChange} style={{color:'black'}}>
      <Picker.Item label={`Select ${label}`} value="" />
      {items.map(item => (
        <Picker.Item key={item._id} label={item.name} value={item._id} />
      ))}
    </Picker>
  </View>
);

const AddShop = () => {
  const [beat, setBeat] = useState([]);
  const [shopClass, setShopClass] = useState([]);
  const [shopType, setShopType] = useState([]);
  const [pinCodeList, setPinCodeList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [beatDetail, setBeatDetail] = useState({});
  const [beatDetailLoading, setBeatDetailLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    getBeat();
    getShopClass();
    getShopType();
    requestCameraPermission().then(granted => {
      if (!granted)
        Alert.alert('Camera permission denied', 'Enable it in settings');
    });
  }, []);

  useEffect(() => {
    getPinCode(beatDetail?.city_id);
  }, [beatDetail]);

  const getBeat = () => {
    getBeatList()
      .then(res => {
        const {data, success, errors} = res.data;
        if (success) {
          setBeat(data.routes);
        } else if (errors) {
          Alert.alert('Error', Object.values(errors).join(', '));
        }
      })
      .catch(e => {
        alert(e);
      });
  };

  const getPinCode = text => {
    getPinCodeList(text, beatDetail?.city_id)
      .then(res => {
        setPinCodeList(res?.data?.data?.pin_codes || []);
      })
      .catch(e => {
        alert(e);
      });
  };

  useEffect(() => {
    if (Object.keys(beatDetail).length) {
      getPinCode('');
    }
  }, [beatDetail]);

  const getShopType = () => {
    getCustomerTypeList()
      .then(res => {
        const {data, success, errors} = res.data;
        if (success) {
          setShopType(data.customer_types);
        }
      })
      .catch(e => {
        alert(e);
      });
  };

  const getShopClass = () => {
    getCustomerClassList()
      .then(res => {
        const {data, success, errors} = res.data;
        if (success) {
          setShopClass(data.customer_classes);
        }
      })
      .catch(e => {
        alert(e);
      });
  };

  const getCurrentLocation = async setFieldValue => {
    
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('always');
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
    }
    setLoadingLocation(true);
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setFieldValue('latitude', latitude);
        setFieldValue('longitude', longitude);
        setLoadingLocation(false);
      },
      error =>{ console.log(error)
        setLoadingLocation(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const handleImagePick = setFieldValue => {
    launchCamera({mediaType: 'photo', quality: 0.7}, response => {
      if (response?.assets?.length) {
        setFieldValue('image', response.assets[0].uri);
      }
    });
  };

  const validateForm = values => {
    const errors = {};
    if (!values.route_id) errors.route_id = 'Beat is required';
    if (!values.name) errors.name = 'Shop name is required';
    if (!values.owner_name) errors.owner_name = 'Owner name is required';
    if (!values.town) errors.town = 'Town is required';
    if (!values.pin_code_id) errors.pin_code_id = 'Pin Code is required';
    if (!values.customer_type_id) {
      errors.customer_type_id = 'Shop type is required';
    }
    if (!values.customer_class_id) {
      errors.customer_class_id = 'Shop class is required';
    }

    if (!values.address) {
      errors.address = 'Address is required';
    }
    if (!values.owner_contact_number) {
      errors.owner_contact_number = 'Contact number is required';
    } else if (!/^[0-9]{10}$/.test(values.owner_contact_number)) {
      errors.owner_contact_number = 'Enter a valid 10-digit number';
    }
    if (!values.image) {
      errors.image = 'Image is required';
    }
    if (!values.longitude || !values.latitude) {
      errors.longitude = 'Location is required';
    }
    return errors;
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
      <SafeAreaView />
      <Formik
        initialValues={{
          route_id: '',
          name: '',
          customer_type_id: '',
          customer_class_id: '',
          pin_code_id: '',
          divisions: '',
          gst_number: '',
          owner_name: '',
          owner_email: '',
          owner_contact_number: '',
          owner_phone_number: '',
          town: '',
          latitude: '',
          longitude: '',
          image: null,
          city: '',
          state: '',
          district: '',
          region: '',
          address: '',
        }}
        onSubmit={(values, {resetForm, setErrors}) => {
          const errors = validateForm(values);
          if (Object.keys(errors).length) {
            setErrors(errors);
            return;
          }

          // const {divisions, city, state, district, region, ...filteredValues} =
          //   values;
          setIsLoading(true);

          const formData = new FormData();

          formData.append('route_id', values.route_id);
          formData.append('name', values.name);
          formData.append('customer_type_id', values.customer_type_id);
          formData.append('customer_class_id', values.customer_class_id);
          formData.append('pin_code_id', values.pin_code_id);
          formData.append('divisions', values.divisions);
          formData.append('gst_number', values.gst_number);
          formData.append('owner_name', values.owner_name);
          formData.append('owner_email', values.owner_email);
          formData.append('owner_contact_number', values.owner_contact_number);
          formData.append('owner_phone_number', values.owner_phone_number);
          formData.append('town', values.town);
          formData.append('latitude', values.latitude);
          formData.append('longitude', values.longitude);
          formData.append('address', values.address);

          if (values.image) {
            formData.append('photo', {
              uri: values.image,
              type: 'image/jpeg',
              name: 'shop.jpeg',
            });
          }

          addShop(formData)
            .then(res => {
              const {data, success, errors} = res.data;
              if (success) {
                Alert.alert('Success', 'Customer added successfully');
                resetForm();
              } else if (errors) {
                setErrors(errors || {});
              }
            })
            .catch(err => console.log(err))
            .finally(() => setIsLoading(false));
        }}>
        {({
          handleChange,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => (
          <View>
            <Subheading style={{color: COLORS.accentPrimary}}>
              Shop Information
            </Subheading>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
              <FormPicker
                label="Beat"
                selectedValue={values.route_id}
                items={beat}
                onValueChange={value => {
                  setBeatDetailLoading(true);
                  setFieldValue('route_id', value);
                  getBeatDetail(value)
                    .then(res => {
                      const {data} = res.data;
                      if (res.data.success) {
                        setBeatDetail(data);
                        setFieldValue('city', data.city_name);
                        setFieldValue('state', data.state_name);
                        setFieldValue('district', data.district_name);
                        setFieldValue('region', data.region_name);
                        setFieldValue('divisions', data.division_names);
                      } else {
                        setBeatDetail({});
                      }
                    })
                    .finally(() => setBeatDetailLoading(false));
                }}
              />
              <ActivityIndicator
                animating={beatDetailLoading}
                style={{position: 'absolute', marginEnd: '7%'}}
              />
            </View>
            {errors.route_id && (
              <Text style={styles.errorText}>{errors.route_id}</Text>
            )}

            <TextInput
              style={styles.input}
              label="Divisions"
              value={values.divisions}
              onChangeText={handleChange('divisions')}
              mode="outlined"
              editable={false}
            />

            <TextInput
              style={styles.input}
              label="Shop Name"
              value={values.name}
              onChangeText={handleChange('name')}
              mode="outlined"
              error={!!errors.name}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <TextInput
              style={styles.input}
              label="Owner Name"
              value={values.owner_name}
              onChangeText={handleChange('owner_name')}
              mode="outlined"
              error={!!errors.owner_name}
            />
            {errors.owner_name && (
              <Text style={styles.errorText}>{errors.owner_name}</Text>
            )}

            <FormPicker
              label="Shop Type"
              selectedValue={values.customer_type_id}
              items={shopType}
              onValueChange={value => setFieldValue('customer_type_id', value)}
            />
            {errors.customer_type_id && (
              <Text style={styles.errorText}>{errors.customer_type_id}</Text>
            )}

            <FormPicker
              label="Shop Class"
              selectedValue={values.customer_class_id}
              items={shopClass}
              onValueChange={value => setFieldValue('customer_class_id', value)}
            />
            {errors.customer_class_id && (
              <Text style={styles.errorText}>{errors.customer_class_id}</Text>
            )}

            <Subheading style={{marginVertical: 10}}>
              Contact Information
            </Subheading>

            <TextInput
              style={styles.input}
              error={!!errors.longitude}
              value={
                values.latitude && values.longitude
                  ? `${values.latitude}, ${values.longitude}`
                  : ''
              }
              editable={false}
              label="GPS Location"
              mode="outlined"
              right={
                loadingLocation ? (
                  <TextInput.Icon
                    icon={() => <ActivityIndicator size={20} />}
                  />
                ) : (
                  <TextInput.Icon
                    icon="map-marker-radius-outline"
                    onPress={() => getCurrentLocation(setFieldValue)}
                  />
                )
              }
            />
            {errors.longitude && (
              <Text style={styles.errorText}>{errors.longitude}</Text>
            )}

            <TextInput
              style={styles.input}
              label="GST Number"
              value={values.gst_number}
              onChangeText={handleChange('gst_number')}
              mode="outlined"
            />

            <TextInput
              style={styles.input}
              label="Address"
              value={values.address}
              onChangeText={handleChange('address')}
              mode="outlined"
              error={!!errors.address}
            />
            {errors.address && (
              <Text style={styles.errorText}>{errors.address}</Text>
            )}

            <ElementPicker
              data={pinCodeList}
              value="_id"
              label="name"
              placeholder="Search pin code"
              searchPlaceholder="Search by number"
              onClearPress={() => setFieldValue('pin_code_id', '')}
              selectedValue={values.pin_code_id}
              iconName="email-newsletter"
              onValueSelect={item => setFieldValue('pin_code_id', item?._id)}
              onChangeText={text => {
                if (text === '') {
                  return;
                }
                getPinCode(text);
              }}
            />
            {errors.pin_code_id && (
              <Text style={styles.errorText}>{errors.pin_code_id}</Text>
            )}

            <TextInput
              style={styles.input}
              label="Town"
              value={values.town}
              onChangeText={handleChange('town')}
              mode="outlined"
              error={!!errors.town}
            />
            {errors.town && <Text style={styles.errorText}>{errors.town}</Text>}

            <TextInput
              style={styles.input}
              label="Contact Number"
              value={values.owner_contact_number}
              onChangeText={handleChange('owner_contact_number')}
              keyboardType="phone-pad"
              maxLength={10}
              mode="outlined"
              error={!!errors.owner_contact_number}
            />
            {errors.owner_contact_number && (
              <Text style={styles.errorText}>
                {errors.owner_contact_number}
              </Text>
            )}

            <TextInput
              style={styles.input}
              label="Phone Number"
              value={values.owner_phone_number}
              onChangeText={handleChange('owner_phone_number')}
              keyboardType="phone-pad"
              maxLength={10}
              mode="outlined"
              error={!!errors.owner_phone_number}
            />
            {errors.owner_phone_number && (
              <Text style={styles.errorText}>{errors.owner_phone_number}</Text>
            )}

            <TextInput
              style={styles.input}
              label="Email"
              value={values.owner_email}
              onChangeText={handleChange('owner_email')}
              keyboardType="email-address"
              mode="outlined"
              error={!!errors.owner_email}
            />
            {errors.owner_email && (
              <Text style={styles.errorText}>{errors.owner_email}</Text>
            )}

            <Subheading style={{color: COLORS.accentPrimary}}>
              Address Details
            </Subheading>

            <TextInput
              style={styles.input}
              label="City"
              value={values.city}
              onChangeText={handleChange('city')}
              mode="outlined"
              error={!!errors.city}
              editable={false}
            />
            {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

            <TextInput
              style={styles.input}
              label="State"
              value={values.state}
              onChangeText={handleChange('state')}
              mode="outlined"
              editable={false}
            />
            {errors.state && (
              <Text style={styles.errorText}>{errors.state}</Text>
            )}

            <TextInput
              style={styles.input}
              label="District"
              value={values.district}
              onChangeText={handleChange('district')}
              mode="outlined"
              editable={false}
            />
            {errors.district && (
              <Text style={styles.errorText}>{errors.district}</Text>
            )}

            <TextInput
              style={styles.input}
              label="Region"
              value={values.region}
              onChangeText={handleChange('region')}
              mode="outlined"
              editable={false}
            />
            {errors.region && (
              <Text style={styles.errorText}>{errors.region}</Text>
            )}

            {values.image && (
              <Image
                source={{uri: values.image}}
                style={{
                  width: '100%',
                  height: 200,
                  borderRadius: 10,
                  marginTop: 10,
                }}
              />
            )}

            <Button
              mode="outlined"
              onPress={() => handleImagePick(setFieldValue)}
              style={{marginVertical: 10, borderColor: COLORS.primary}}>
              Take Photo
            </Button>
            {errors.image && (
              <Text style={styles.errorText}>{errors.image}</Text>
            )}

            <Button
              disabled={isLoading}
              style={styles.btn}
              onPress={handleSubmit}
              loading={isLoading}
              mode="contained">
              Submit
            </Button>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default AddShop;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'android' && Platform.Version >= 33 ? 40 : 6,
    // backgroundColor: '#f1f9fe'
  },
  input: {
    marginTop: 10,
    backgroundColor: 'white',
  },
  picker: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 10,
  },
  label: {
    color: COLORS.accentPrimary,
    marginBottom: 10,
  },
  errorText: {
    color: COLORS.error,
    marginLeft: 5,
    fontSize: 12,
  },
  btn: {
    marginBottom: 25,
    marginTop: 10,
  },
});
