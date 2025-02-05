import {Picker} from '@react-native-picker/picker';
import {Formik} from 'formik';
import React, {useEffect, useState} from 'react';
import {
  PermissionsAndroid,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Button, Subheading, Text, TextInput} from 'react-native-paper';
import SearchableDropdown from 'react-native-searchable-dropdown';
import {COLORS} from '../constants/theme/colors';
import {
  getBeatList,
  getCustomerClassList,
  getCustomerTypeList,
  getPinCodeList,
  getCitiesList,
  getCitiesDetail,
  addShop,
  getState,
  getCustomerActivityList,
} from '../services/retailer_services';
import Geolocation from 'react-native-geolocation-service';
const initialValues = {
  route_id: '',
  name: '',
  address: '',
  customer_type_id: '',
  customer_class_id: '',
  customer_activity_category_id: '',
  gst_number: '',
  owner_name: '',
  owner_email: '',
  owner_contact_number: '',
  billing_address: '',
  billing_city: '',
  billing_state_id: '',
  billing_district: '',
  billing_tehsil: '',
  billing_pincode: '',
  shipping_pincode: '',
  shipping_city: '',
  shipping_state_id: '',
  shipping_district: '',
  shipping_tehsil: '',
  shipping_address: '',
  referred_by: '',
  town: '',
};
const AddShop = ({navigation}) => {
  const [beat, setBeat] = useState([]);
  const [shopClass, setShopClass] = useState([]);
  const [shopType, setShopType] = useState([]);
  const [customerActivity, setCustomerActivity] = useState([]);
  const [state, setState] = useState([]);
  const [pinCodeList, setPinCodeList] = useState([]);
  const [selectedPinCode, setSelectedPinCode] = useState({});
  const [cityList, setCityList] = useState([]);
  const [cityDetail, setCityDetail] = useState({});
  const [selectedCity, setSelectedCity] = useState({});
  const [location, setLocation] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});
  useEffect(() => {
    getBeat();
    getShopType();
    getShopClass();
    getStateValue();
    getCustomerActivity();
  }, []);

  const getBeat = () => {
    getBeatList()
      .then(res => {
        const {data, success, errors} = res.data;
        if (success) {
          setBeat(data.routes);
        }
      })
      .catch(e => {
        alert(e);
      });
  };

  const getStateValue = () => {
    getState()
      .then(res => {
        const {data, success, errors} = res.data;
        if (success) {
          setState(data.states);
        }
      })
      .catch(e => {
        console.log(e);
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
  const getCurrentLocation = async () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('always');
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Access Location Permission',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted !== 'granted') {
        return;
      }
    }

    Geolocation.getCurrentPosition(
      position => {
        var data = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(data);
      },
      error => {
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };
  const getShopType = () => {
    getCustomerTypeList()
      .then(res => {
        console.log(res.data);
        const {data, success, errors} = res.data;
        if (success) {
          setShopType(data.customer_types);
        }
      })
      .catch(e => {
        alert(e);
      });
  };

  const getCustomerActivity = () => {
    getCustomerActivityList()
      .then(res => {
        console.log(res.data);
        const {data, success, errors} = res.data;
        if (success) {
          setCustomerActivity(data.customer_activity_categories);
        }
      })
      .catch(e => {
        alert(e);
      });
  };

  return (
    <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.container}>
      <SafeAreaView />
      <Formik
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={initialValues}
        onSubmit={(values, {resetForm}) => {
          setIsLoading(true);
          var data = {
            longitude: location.longitude,
            latitude: location.latitude,
            // billing_city_id: selectedCity._id,
            // billing_pin_code_id: selectedPinCode._id,
          };
          let temp = {
            ...values,
            ...data,
          };

          console.log('post', temp);

          addShop(temp)
            .then(res => {
              console.log(res);
              const {data, errors, success} = res.data;
              if (success) {
                alert('Customer is Successfully added');
                resetForm({values: initialValues, errors: {}, touched: {}});
                setSelectedCity({});
                setSelectedPinCode({});
                setLocation({});
                setCityDetail({});
              } else {
                // alert(JSON.stringify(errors));
                console.log('addShop', errors);
                setError(errors);
              }
            })
            .catch(e => alert(e))
            .finally(() => setIsLoading(false));
        }}>
        {({handleChange, handleBlur, handleSubmit, values, errors}) => (
          <View>
            <Subheading style={styles.label}>Shop Information</Subheading>
            <View style={styles.picker}>
              <Picker
                selectedValue={values.route_id}
                mode="dropdown"
                style={{color:'black',}}
                dropdownIconColor= 'black'
                onValueChange={handleChange('route_id')}>
                <Picker.Item label="Select Beat (Required)" value="" />
                {beat.map(item => (
                  <Picker.Item
                    key={item._id}
                    label={item.name}
                    value={item._id}
                  />
                ))}
              </Picker>
            </View>
            {error.route_id && (
              <Text style={styles.errorText}>{error.route_id}</Text>
            )}
            <TextInput
              style={styles.input}
              value={values.name}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              error={error.name ? true : false}
              label="Shop Name (Required)"
              mode="outlined"
            />
            {error.name && <Text style={styles.errorText}>{error.name}</Text>}
            <TextInput
              style={styles.input}
              value={values.owner_name}
              onChangeText={handleChange('owner_name')}
              onBlur={handleBlur('owner_name')}
              label="Owner Name (Required)"
              error={error.owner_name ? true : false}
              mode="outlined"
            />
            {error.owner_name && (
              <Text style={styles.errorText}>{error.owner_name}</Text>
            )}
            <View style={styles.picker}>
              <Picker
                style={{color:'black'}}
                dropdownIconColor= 'black'
                selectedValue={values.customer_type_id}
                onBlur={handleBlur('customer_type_id')}
                mode="dropdown"
                onValueChange={handleChange('customer_type_id')}>
                <Picker.Item label="Select Shop Type" value="" />
                {shopType.map(item => (
                  <Picker.Item
                    key={item._id}
                    label={item.name}
                    value={item._id}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.picker}>
              <Picker
                 style={{color:'black'}}
                 dropdownIconColor= 'black'
                selectedValue={values.customer_class_id}
                mode="dropdown"
                onBlur={handleBlur('customer_class_id')}
                onValueChange={handleChange('customer_class_id')}>
                <Picker.Item label="Select Shop CLass" value="" />
                {shopClass.map(item => (
                  <Picker.Item       
                    key={item._id}
                    label={item.name}
                    value={item._id}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.picker}>
              <Picker
                 style={{color:'black'}}
                dropdownIconColor= 'black'
                selectedValue={values.customer_activity_category_id}
                mode="dropdown"
                onBlur={handleBlur('customer_activity_category_id')}
                onValueChange={handleChange('customer_activity_category_id')}>
                <Picker.Item label="Select Customer Activity" value="" />
                {customerActivity.map(item => (
                  <Picker.Item
                    key={item._id}
                    label={item.name}
                    value={item._id}
                  />
                ))}
              </Picker>
            </View>
            <Subheading style={styles.label}>Contact Information</Subheading>
            <TextInput
              style={styles.input}
              value={
                location.latitude
                  ? location.latitude + ',' + location.longitude
                  : ''
              }
              editable={false}
              label="GPS Location"
              mode="outlined"
              right={
                <TextInput.Icon
                  icon="map-marker-radius-outline"
                  onPress={() => getCurrentLocation()}
                />
              }
            />
            <TextInput
              style={styles.input}
              value={values.gst_number}
              onChangeText={handleChange('gst_number')}
              label="GST number"
              maxLength={15}
              mode="outlined"
              error={error.gst_number ? true : false}
            />
            {error.gst_number && (
              <Text style={styles.errorText}>{error.gst_number}</Text>
            )}
            <TextInput
              style={styles.input}
              value={values.town}
              onChangeText={handleChange('town')}
              label="Town"
              maxLength={15}
              mode="outlined"
              error={error.town ? true : false}
            />
            {error.town && <Text style={styles.town}>{error.town}</Text>}
            <TextInput
              style={styles.input}
              value={values.owner_contact_number}
              onBlur={handleBlur('owner_contact_number')}
              onChangeText={handleChange('owner_contact_number')}
              keyboardType="phone-pad"
              label="Contact Number (Required)"
              maxLength={10}
              mode="outlined"
              error={error.owner_contact_number ? true : false}
            />
            {error.owner_contact_number && (
              <Text style={styles.errorText}>{error.owner_contact_number}</Text>
            )}
            <TextInput
              style={styles.input}
              value={values.owner_email}
              onBlur={handleBlur('owner_email')}
              onChangeText={handleChange('owner_email')}
              keyboardType="email-address"
              label="Email Id (Required)"
              mode="outlined"
              error={errors.owner_email || error.owner_email ? true : false}
            />
            {(errors.owner_email || error.owner_email) && (
              <Text style={styles.errorText}>
                {errors.owner_email || error.owner_email}
              </Text>
            )}
            <TextInput
              style={styles.input}
              value={values.referred_by}
              onBlur={handleBlur('referred_by')}
              onChangeText={handleChange('referred_by')}
              label="Referred by"
              mode="outlined"
              error={errors.referred_by || error.referred_by ? true : false}
            />
            {(errors.referred_by || error.referred_by) && (
              <Text style={styles.errorText}>
                {errors.referred_by || error.referred_by}
              </Text>
            )}
            <Subheading style={styles.label}>Primary Address</Subheading>
            <View style={styles.picker}>
              <Picker
                 style={{color:'black'}}
                dropdownIconColor= 'black'
                selectedValue={values.billing_state_id}
                onBlur={handleBlur('billing_state_id')}
                mode="dropdown"
                onValueChange={handleChange('billing_state_id')}>
                <Picker.Item label="Select State" value="" />
                {state.map(item => (
                  <Picker.Item
                    key={item._id}
                    label={item.name}
                    value={item._id}
                  />
                ))}
              </Picker>
            </View>
            <TextInput
              style={styles.input}
              value={values.billing_pincode}
              onChangeText={handleChange('billing_pincode')}
              onBlur={handleBlur('billing_pincode')}
              error={error.billing_pincode ? true : false}
              label="Pin Code"
              mode="outlined"
            />

            {(errors.billing_pincode || error.billing_pincode) && (
              <Text style={styles.errorText}>
                {errors.billing_pincode || error.billing_pincode}
              </Text>
            )}

            <TextInput
              style={styles.input}
              value={values.billing_city}
              onChangeText={handleChange('billing_city')}
              onBlur={handleBlur('billing_city')}
              error={error.billing_city ? true : false}
              label="City"
              mode="outlined"
            />

            {(errors.billing_city || error.billing_city) && (
              <Text style={styles.errorText}>
                {errors.billing_city || error.billing_city}
              </Text>
            )}

            <TextInput
              style={styles.input}
              //value={cityDetail.district}
              value={values.billing_district}
              onChangeText={handleChange('billing_district')}
              onBlur={handleBlur('billing_district')}
              error={error.billing_district ? true : false}
              label="District"
              mode="outlined"
            />
            {error.billing_district && (
              <Text style={styles.errorText}>{error.billing_district}</Text>
            )}

            <TextInput
              style={styles.input}
              //value={cityDetail.region}
              value={values.billing_tehsil}
              onChangeText={handleChange('billing_tehsil')}
              onBlur={handleBlur('billing_tehsil')}
              label="Tehsil "
              mode="outlined"
            />
            <TextInput
              style={styles.input}
              value={values.billing_address}
              onBlur={handleBlur('billing_address')}
              onChangeText={handleChange('billing_address')}
              label="Address"
              mode="outlined"
            />
            <Subheading style={styles.label}>Shipping Address</Subheading>
            <View style={styles.picker}>
              <Picker
                style={{color:'black'}}
                 dropdownIconColor= 'black'
                selectedValue={values.shipping_state_id}
                onBlur={handleBlur('shipping_state_id')}
                mode="dropdown"
                onValueChange={handleChange('shipping_state_id')}>
                <Picker.Item label="Select State" value="" />
                {state.map(item => (
                  <Picker.Item
                    key={item._id}
                    label={item.name}
                    value={item._id}
                  />
                ))}
              </Picker>
            </View>
            <TextInput
              style={styles.input}
              value={values.shipping_pincode}
              onChangeText={handleChange('shipping_pincode')}
              onBlur={handleBlur('shipping_pincode')}
              error={error.shipping_pincode ? true : false}
              label="Pin Code"
              mode="outlined"
            />

            {(errors.shipping_pincode || error.shipping_pincode) && (
              <Text style={styles.errorText}>
                {errors.shipping_pincode || error.shipping_pincode}
              </Text>
            )}

            <TextInput
              style={styles.input}
              value={values.shipping_city}
              onChangeText={handleChange('shipping_city')}
              onBlur={handleBlur('shipping_city')}
              error={error.shipping_city ? true : false}
              label="City"
              mode="outlined"
            />

            {(errors.shipping_city || error.shipping_city) && (
              <Text style={styles.errorText}>
                {errors.shipping_city || error.shipping_city}
              </Text>
            )}

            <TextInput
              style={styles.input}
              //value={cityDetail.district}
              value={values.shipping_district}
              onChangeText={handleChange('shipping_district')}
              onBlur={handleBlur('shipping_district')}
              error={error.shipping_district ? true : false}
              label="District"
              mode="outlined"
            />
            {error.shipping_district && (
              <Text style={styles.errorText}>{error.shipping_district}</Text>
            )}

            <TextInput
              style={styles.input}
              //value={cityDetail.region}
              value={values.shipping_tehsil}
              onChangeText={handleChange('shipping_tehsil')}
              onBlur={handleBlur('shipping_tehsil')}
              label="Tehsil"
              mode="outlined"
            />

            {error.shipping_tehsil && (
              <Text style={styles.errorText}>{error.shipping_tehsil}</Text>
            )}

            <TextInput
              style={styles.input}
              value={values.shipping_address}
              onBlur={handleBlur('shipping_address')}
              onChangeText={handleChange('shipping_address')}
              label="Address"
              mode="outlined"
            />
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
    paddingTop: 10,
  },
  input: {
    marginTop: 10,
    backgroundColor: 'white',
  },
  picker: {
    width: '100%',
    border: 1,
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
  },
  btn: {
    marginBottom: 25,
    marginTop: 10,
  },
});
