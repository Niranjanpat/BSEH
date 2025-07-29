import { SafeAreaView, ScrollView, View } from 'react-native'
import React from 'react'
import { Button, Subheading, Text, TextInput } from 'react-native-paper'
import { stylesSupplier } from '../styles/SupplierStyles';
import CurrentLocationView from '../../../../components/settings/supplier/CurrentLocationView';
import useUpdateSuperStockist from '../../../../hooks/supplier/useUpdateDistributor';

const SuperStockistUpdateScreen = ({route, navigation}) => {

  const {id, data} = route.params;

  const {
    values,
    errors,
    isSubmitting,
    setFieldValue,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useUpdateSuperStockist(data, id);
  
  return (
    <ScrollView keyboardShouldPersistTaps={'handled'} style={stylesSupplier.updateContainer}>
      <SafeAreaView />
      <View>
        <Subheading style={stylesSupplier.label}>General Information</Subheading>

        <TextInput
          style={stylesSupplier.input}
          value={values.email}
          onChangeText={handleChange('email')}
          onBlur={handleBlur('email')}
          error={errors.email ? true : false}
          label="E-Mail"
          autoCapitalize='none'
          keyboardType="email-address"
        />
        {errors.email && <Text style={stylesSupplier.errorText}>{errors.email}</Text>}

        <TextInput
          style={stylesSupplier.input}
          value={values.contact_person}
          onBlur={handleBlur('contact_person')}
          onChangeText={(text) => {
            const value = text.replace(/[^A-Z a-z]/ig, '');
            setFieldValue('contact_person', value);
          }}
          label="Contact Person"
          error={errors.contact_person ? true : false}
        />
        {errors.contact_person && (
          <Text style={stylesSupplier.errorText}>{errors.contact_person}</Text>
        )}

        <TextInput
          style={stylesSupplier.input}
          value={values.contact_number_1}
          onBlur={handleBlur('contact_number_1')}
          onChangeText={handleChange('contact_number_1')}
          keyboardType="number-pad"
          label="Contact Number 1"
          maxLength={10}
          error={errors.contact_number_1 ? true : false}
        />
        {errors.contact_number_1 && (
          <Text style={stylesSupplier.errorText}>
            {errors.contact_number_1}
          </Text>
        )}

        <TextInput
          style={stylesSupplier.input}
          value={values.contact_number_2}
          onBlur={handleBlur('contact_number_2')}
          onChangeText={handleChange('contact_number_2')}
          keyboardType="number-pad"
          label="Contact Number 2"
          maxLength={10}
          error={errors.contact_number_2 ? true : false}
        />
        {errors.contact_number_2 && (
          <Text style={stylesSupplier.errorText}>
            {errors.contact_number_2}
          </Text>
        )}

        <Subheading style={stylesSupplier.label}>Shop Information</Subheading>
        <TextInput
          style={stylesSupplier.input}
          value={values.address}
          onBlur={handleBlur('address')}
          onChangeText={handleChange('address')}
          label="Address"
          error={errors.address ? true : false}
        />
        {errors.address && (
          <Text style={stylesSupplier.errorText}>{errors.address}</Text>
        )}

        <TextInput
          style={stylesSupplier.input}
          value={values.food_license}
          onChangeText={handleChange('food_license')}
          onBlur={handleBlur('food_license')}
          error={errors.food_license ? true : false}
          label="Food license"
          keyboardType="number-pad"
        />
        {errors.food_license && (
          <Text style={stylesSupplier.errorText}>{errors.food_license}</Text>
        )}

        <TextInput
          style={stylesSupplier.input}
          value={values.gst_number}
          onChangeText={handleChange('gst_number')}
          label="GST Number"
          onBlur={handleBlur('gst_number')}
          autoCapitalize='characters'
          maxLength={15}
          error={errors.gst_number ? true : false}
        />
        {errors.gst_number && (
          <Text style={stylesSupplier.errorText}>{errors.gst_number}</Text>
        )}
        
        <Subheading style={stylesSupplier.label}>Location Information</Subheading>
        
        <CurrentLocationView onSetLocation={(location) => {
          setFieldValue('latitude', location?.latitude ?? '');
          setFieldValue('longitude', location?.longitude ?? '');
        }}/>
        {errors.longitude && (
          <Text style={stylesSupplier.errorText}>{errors.longitude}</Text>
        )}
        {errors.latitude && (
          <Text style={stylesSupplier.errorText}>{errors.latitude}</Text>
        )}

        <Button
          disabled={isSubmitting}
          style={stylesSupplier.btn}
          onPress={handleSubmit}
          loading={isSubmitting}
          mode="contained">
          Submit
        </Button>
      </View>
    </ScrollView>
  );
}

export default SuperStockistUpdateScreen