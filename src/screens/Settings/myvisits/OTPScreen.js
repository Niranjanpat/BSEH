import React, {useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CountDownTimer from 'react-native-countdown-timer-hooks';
import {Button, TextInput} from 'react-native-paper';
import {COLORS} from '../../../constants/theme/colors';
import {sendOTP, verifyOTP} from '../../../services/activity_service';

const OTPScreen = ({route, navigation}) => {
  const {id} = route.params;

  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [isResent, setIsResent] = useState(false);
  const [time, setTime] = useState(60);
  const handleVerification = () => {
    setLoading(true);
    verifyOTP(id, otp)
      .then(res => {
        setLoading(false);

        const {success, errors} = res?.data;

        if (success) {
          Alert.alert('Success', 'Contact number has been verified');
          navigation.goBack();
        } else {
          const {otp} = errors;

          if (otp) {
            Alert.alert('Error', otp);
          }
        }
      })
      .catch(err => {
        setLoading(false);
        Alert.alert(JSON.stringify(err));
      });
  };

  const handleSMSSend = () => {
    sendOTP(id)
      .then(res => {
        setLoading(false);

        const {errors, success} = res?.data;

        if (success) {
          Alert.alert('Success', "OTP has been sent to the owner's number");
          setTime(60);
          setIsResent(false);
        } else {
          const {otp} = errors;

          if (otp) {
            Alert.alert('Error', otp);
            return;
          }

          Alert.alert('Error', JSON.stringify(errors));
        }
      })
      .catch(err => {
        Alert.alert(JSON.stringify(err));
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={otp}
        onChangeText={setOtp}
        mode="outlined"
        label="Enter OTP"
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginVertical: 10,
        }}>
        <View style={styles.countdown}>
          <CountDownTimer
            timestamp={time}
            timerCallback={() => setIsResent(true)}
          />
        </View>

        <Text style={{textAlign: 'center', justifyContent: 'center'}}>
          seconds remaining
        </Text>
        <TouchableOpacity onPress={handleSMSSend} disabled={!isResent}>
          <Text style={{color: isResent ? COLORS.primary : COLORS.darkGrey}}>
            {' '}
            Resend
          </Text>
        </TouchableOpacity>
      </View>

      <Button
        style={styles.button}
        mode="contained"
        disabled={loading}
        loading={loading}
        onPress={handleVerification}>
        Verify
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    flex: 1,
  },
  input: {
    marginTop: 10,
    backgroundColor: COLORS.background,
  },
  button: {
    marginVertical: 10,
  },
  countdown: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
});

export default OTPScreen;
