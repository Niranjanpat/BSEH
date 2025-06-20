import dayjs from 'dayjs';
import React, { useState } from 'react';
import {
  Button,
  TextInput,
  RadioButton,
  Text,
  Subheading,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { SPACINGS } from '../../constants/theme';
import { updateUserProfile } from '../../services/auth_service';
import { storeAccount } from '../../store/actions/auth';
import { COLORS } from '../../constants/theme/colors';

const maximumDate = dayjs().subtract(13, 'year').toDate();

const UpdateProfileScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const { profile } = useSelector(state => state.auth);

  const initialDate = profile.date_of_birth ? dayjs(profile.date_of_birth).toDate() : null;

  const [dob, setDob] = useState(initialDate);
  const [email, setEmail] = useState(profile.email || '');
  const [phone, setPhone] = useState(profile.contact_number || '');
  const [address, setAddress] = useState(profile.address || '');
  const [gender, setGender] = useState(profile.gender || 'male');

  const [isDobVisible, setIsDobVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const btnSubmitEnabled = dob && email && phone && address;

  const formattedDob = dob ? dayjs(dob).format('YYYY-MM-DD') : '';

  const handleDobModal = () => {
    setIsDobVisible(true);
  };

  const validation = () => {
    if (!dob) {
      Alert.alert(null, 'Please select your date of birth');
      return false;
    }
    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert(null, 'Email address you entered is invalid');
      return false;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      Alert.alert(null, 'Phone number you entered is invalid');
      return false;
    }
    if (!address.trim()) {
      Alert.alert(null, 'Address you entered is invalid');
      return false;
    }
    return true;
  };

  const updateProfile = () => {
    setIsLoading(true);
    const body = {
      gender,
      date_of_birth: formattedDob,
      email,
      contact_number: phone,
      address,
    };

    updateUserProfile(body)
      .then(res => {
        const { data, success, errors } = res.data;
        if (success) {
          dispatch(storeAccount({ ...profile, ...body }));
          Alert.alert('Success', 'Your profile has been successfully updated.');
          navigation.goBack();
        } else if (errors) {
          Alert.alert(null, Object.values(errors).join(', '));
        }
      })
      .catch(err => {
        console.error('update profile error:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmit = () => {
    if (validation()) {
      updateProfile();
    }
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.section}>
        <Subheading style={styles.sectionTitle}>Gender</Subheading>
        <RadioButton.Group onValueChange={setGender} value={gender}>
          <View style={styles.genderRow}>
            <RadioButton value="male" />
            <Text style={styles.genderLabel}>Male</Text>
          </View>
          <View style={styles.genderRow}>
            <RadioButton value="female" />
            <Text style={styles.genderLabel}>Female</Text>
          </View>
        </RadioButton.Group>
      </View>

      <View style={styles.section}>
        <Subheading style={styles.sectionTitle}>Date of Birth</Subheading>
        <Pressable onPress={handleDobModal} style={styles.dateInputWrapper} android_ripple={{ color: '#eee' }}>
          <TextInput
            editable={false}
            value={formattedDob}
            placeholder="Select your date of birth"
            style={styles.dateInput}
            pointerEvents="none"
            mode="outlined"
          />
        </Pressable>
      </View>

      <View style={styles.section}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          mode="outlined"
          style={styles.textInput}
          autoCapitalize="none"
          autoComplete="email"
        />
      </View>

      <View style={styles.section}>
        <TextInput
          label="Contact Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          maxLength={10}
          mode="outlined"
          style={styles.textInput}
        />
      </View>

      <View style={styles.section}>
        <TextInput
          label="Address"
          value={address}
          onChangeText={setAddress}
          mode="outlined"
          multiline
          numberOfLines={2}
          style={styles.textInput}
        />
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit}
        labelStyle={{fontWeight:'bold',color:'black'}}
        disabled={!btnSubmitEnabled || isLoading}
        loading={isLoading}
        style={styles.submitButton}
        contentStyle={{ height: 48 }}
      >
        Submit
      </Button>

      <DatePicker
        modal
        mode="date"
        open={isDobVisible}
        maximumDate={maximumDate}
        date={dob || maximumDate}
        onConfirm={date => {
          setIsDobVisible(false);
          setDob(date);
        }}
        onCancel={() => setIsDobVisible(false)}
      />
    </ScrollView>
  );
};

export default UpdateProfileScreen;

const styles = StyleSheet.create({
  contentContainer: {
    padding: SPACINGS.md,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  section: {
    marginBottom: SPACINGS.sm,
  },
  sectionTitle: {
    marginBottom: SPACINGS.sm,
    fontWeight: '600',
    fontSize: 16,
    color: '#444',
  },
  genderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACINGS.sm,
  },
  genderLabel: {
    fontSize: 15,
    color: '#222',
  },
  dateInputWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  dateInput: {
    backgroundColor: '#f9f9f9',
  },
  textInput: {
    backgroundColor: '#f9f9f9',
  },
  submitButton: {
    borderRadius: 8,
    backgroundColor:COLORS.primary,
  },
});
