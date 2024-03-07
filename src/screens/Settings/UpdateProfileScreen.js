import dayjs, {Dayjs} from 'dayjs';
import React, {useState} from 'react';
import {
  Button,
  TextInput,
  RadioButton,
  Text,
  Subheading,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import DatePicker from 'react-native-date-picker';
import {Alert, Pressable, ScrollView, StyleSheet, View} from 'react-native';

import {SPACINGS} from '../../constants/theme';
import {updateUserProfile} from '../../services/auth_service';
import {storeAccount} from '../../store/actions/auth';

const maximumDate = dayjs().subtract(13, 'year').toDate();
const UpdateProfileScreen = ({}) => {
  const dispatch = useDispatch();
  const {profile} = useSelector(state => state.auth);

  // initial date will be string received from api
  // change string date to date format
  const date =
    profile.date_of_birth !== null
      ? dayjs(profile.date_of_birth).toDate()
      : null;

  const [dob, setDob] = useState(date);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.contact_number);
  const [address, setAddress] = useState(profile.address);
  const [gender, setGender] = useState(
    profile.gender ? profile.gender : 'male',
  );

  const [isDobVisible, setIsDobVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // disable button if one of them is null or empty string
  const btnSubmitEnabled = dob && email && phone && address;

  // format date in YYYY-MM-DD to send in the api
  const formattedDob = dob ? dayjs(dob).format('YYYY-MM-DD') : null;

  const handleDobModal = () => {
    setIsDobVisible(true);
  };

  const handleSubmit = () => {
    if (validation()) {
      updateProfile();
    }
  };

  const validation = () => {
    if (dob === null) {
      Alert.alert(null, 'Please select your date of birth');

      return false;
    }

    if (!email.includes('@') && !email.includes('.')) {
      Alert.alert(null, 'Email address you entered is invalid');

      return false;
    }

    const phoneRegex = new RegExp(/^[0-9\b]+$/);
    if (!phone.match(phoneRegex) || phone.length !== 10) {
      Alert.alert(null, 'Phone number you entered is invalid');

      return false;
    }

    if (address === '') {
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
      email: email,
      contact_number: phone,
      address: address,
    };

    updateUserProfile(body)
      .then(res => {
        const {data, success, errors} = res.data;

        if (success) {
          console.log(data);
          dispatch(storeAccount({...profile, ...body}));
          Alert.alert('Success', 'Your profile has been successfully updated.');
        } else {
          Alert.alert(null, JSON.stringify(errors));
        }
      })
      .catch(err => {
        console.log('update profile', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.input}>
        <Subheading>Gender</Subheading>
        <RadioButton.Group onValueChange={val => setGender(val)} value={gender}>
          <View style={styles.genderRow}>
            <RadioButton value="male" />
            <Text>Male</Text>
          </View>
          <View style={styles.genderRow}>
            <RadioButton value="female" />
            <Text>Female</Text>
          </View>
        </RadioButton.Group>
      </View>

      <View style={styles.input}>
        <Pressable onPress={handleDobModal}>
          <TextInput
            editable={false}
            value={formattedDob}
            label="Date of birth"
          />
        </Pressable>
      </View>
      <View style={styles.input}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          label="Email"
        />
      </View>
      <View style={styles.input}>
        <TextInput
          value={phone}
          keyboardType="numeric"
          onChangeText={setPhone}
          label="Contact Number"
          maxLength={10}
        />
      </View>
      <View style={styles.input}>
        <TextInput value={address} onChangeText={setAddress} label="Address" />
      </View>

      <Button
        onPress={handleSubmit}
        disabled={!btnSubmitEnabled || isLoading}
        loading={isLoading}
        mode="contained">
        Submit
      </Button>

      <DatePicker
        modal
        mode="date"
        open={isDobVisible}
        maximumDate={maximumDate}
        onConfirm={val => {
          setIsDobVisible(false);
          setDob(val);
        }}
        onCancel={() => setIsDobVisible(false)}
        date={dob ? dob : maximumDate}
      />
    </ScrollView>
  );
};

export default UpdateProfileScreen;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: SPACINGS.sm,
  },

  input: {
    marginBottom: SPACINGS.sm,
  },

  genderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
