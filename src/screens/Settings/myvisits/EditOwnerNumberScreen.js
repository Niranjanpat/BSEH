import { View, Text, StyleSheet, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS } from '../../../constants/theme/colors';
import { Button, TextInput } from 'react-native-paper';
import { updateCustomerNumber } from '../../../services/activity_service';
import { useFocusEffect } from '@react-navigation/native';

const EditOwnerNumberScreen = ({ route, navigation }) => {
  const { owner_contact_number, id } = route.params;

  const [contactNumber, setContactNumber] = useState(owner_contact_number);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTime, setShowTime] = useState(true);
  const [time, setTime] = useState(0);

  const handleUpdate = () => {
    setLoading(true);

    updateCustomerNumber(id, contactNumber)
      .then(res => {
        setLoading(false);

        const { success, errors } = res?.data;

        if (success) {
          Alert.alert('Updated', 'Owner number has been updated');
          navigation.goBack();
        } else {
         Alert.alert('Error', Object.values(errors).join(', '));
        }
      })
      .catch(err => {
        setLoading(false);
        alert(err);
      });
  };

  const sendOtp = () => {
    startOTPTimer();
  }

  const startOTPTimer = () => {
    setTime(59);
  }

  const stopOTPTime = () => {
    setTime(0);
  }

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (time > 0) {
  //       setTime(time - 1);
  //     }
  //   }, 1000); 
  //   return () => clearInterval(interval); 
  // });

  return (
    <View style={styles.container}>
      <TextInput
        value={contactNumber}
        onChangeText={setContactNumber}
        keyboardType="number-pad"
        style={styles.input}
        mode="outlined"
        label="Owner contact number"
        maxLength={(10)}
      />
      {/* <View style={styles.container_otp}>
        <TextInput
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          style={styles.input}
          mode="outlined"
          label="Enter OTP"
        />
        {showTime && (time > 0 ?
          (<View style={styles.container_resend}>
          <Text style={styles.title}>Time Remaining:</Text>
          <Text style={styles.text_time}>{time < 10 ? `00:0${time}` : `00:${time}`}</Text>
          </View>) :
          (<View style={styles.container_resend}>
            <Text style={styles.title}>Didn't receive OTP ? </Text>
            <Button
              style={styles.button}
              mode="contained"
              disabled={loading}
              loading={loading}
              onPress={sendOtp}>
              Resend
            </Button>
          </View>))
        }
      </View> */}
      <Button
        style={styles.button}
        mode="contained"
        disabled={loading}
        loading={loading}
        onPress={handleUpdate}>
        Update
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  container_otp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  container_resend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: COLORS.background,
  },
  button: {
    marginVertical: 10,
  },
  title: {
    paddingHorizontal: 5,
    color: "black",
  },
  text_time: {
    paddingEnd: 10,
    color: COLORS.primary,
  },
});

export default EditOwnerNumberScreen;
