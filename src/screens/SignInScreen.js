import React, {useRef, useEffect, useState} from 'react';
import {Alert, Image, Keyboard, StyleSheet, View} from 'react-native';
import MMKVStorage from 'react-native-mmkv-storage';
import {IconButton, Text, TextInput} from 'react-native-paper';
import VersionNumber from 'react-native-version-number';
import {useDispatch} from 'react-redux';
import Wave1 from '../../assets/svg/wave1.svg';
import Wave2 from '../../assets/svg/wave2.svg';
import {IMAGE} from '../constants/images';
import {ROUTES} from '../constants/routes';
import {COLORS} from '../constants/theme/colors';
import {login} from '../services/auth_service';
import {
  fetchJointWorkStatus,
  getAttendanceStatus,
  getProfileDetail,
  storeIsInvalid,
  storeRole,
  storeToken,
} from '../store/actions/auth';
import {initOrderCart} from '../store/actions/cart';
import {getRetailerList} from '../store/actions/retailer';
import DeviceInfo from 'react-native-device-info';

const mmkv = new MMKVStorage.Loader().initialize();
const SignInScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const emailRef = useRef();
  const passwordRef = useRef();
  const deviceInfo = useRef({
    deviceId: null,
    deviceName: null,
    deviceVersion: null,
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPwdHidden, setIsPwdHidden] = useState(true);

  const getDeviceInfo = async () => {
    deviceInfo.current.deviceId = await DeviceInfo.getUniqueId();
    deviceInfo.current.deviceVersion = DeviceInfo.getSystemVersion();
    deviceInfo.current.deviceName = await DeviceInfo.getDeviceName();
  };

  useEffect(() => {
    getDeviceInfo();
  }, []);

  const validateAndLogin = async () => {
    if (email === '') {
      emailRef.current.focus();
      return;
    }
    if (password === '') {
      passwordRef.current.focus();
      return;
    }
    if (
      !deviceInfo.current.deviceId ||
      !deviceInfo.current.deviceName ||
      !deviceInfo.current.deviceVersion
    ) {
      await getDeviceInfo();
    }

    onSumbit();
  };

  const onSumbit = () => {
    Keyboard.dismiss();
    setIsLoading(true);

    login(email, password, deviceInfo.current)
      .then(res => {
        const {data, success, errors} = res.data;

        if (success) {
          console.log('user', data);
          mmkv.setString('token', data.token);
          mmkv.setString('role', data.role);
          dispatch(storeRole(data.role));
          dispatch(storeToken(data.token));
          dispatch(getProfileDetail());
          if (data.role == 'asm' || data.role == 'sc') {
            dispatch(getRetailerList());
          } else {
            dispatch(fetchJointWorkStatus());
          }
          dispatch(getAttendanceStatus());
          dispatch(initOrderCart());
          setIsLoading(false);
          navigation.replace(ROUTES.bottomtab_stack);
        } else if (errors) {
          setIsLoading(false);
          console.log(errors);
          if (errors?.email) {
            Alert.alert('Fail', errors.email);
            return;
          } else {
            Alert.alert('Fail', Object.values(errors).join(', '));
            return;
          }
        }
      })
      .catch(e => {
        setIsLoading(false);
        console.log(e);
        Alert.alert('Error', e.toString());
      })
      .finally(() => setIsLoading(false));;
  };

  return (
    <>
      {/* <Wave1 /> */}
      <Image
        style={{height: '100%', width: '100%'}}
        source={IMAGE.gyanpath_bg}
      />
      {/* <View style={{flex: 1}} /> */}
      {/* <Wave2 /> */}
      <View style={styles.container}>
        {/* <Image source={IMAGE.logo_ruchi} style={styles.image} /> */}
        <Text style={styles.text}>LOGIN</Text>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 3}}>
            <TextInput
              label="Login ID"
              value={email}
              ref={emailRef}
              mode="outlined"
              returnKeyType="next"
              style={styles.textInput}
              onChangeText={text => setEmail(text)}
              activeOutlineColor={COLORS.primaryDark}
              onEndEditing={() => passwordRef.current.focus()}
            />
            <TextInput
              mode="outlined"
              label="Password"
              ref={passwordRef}
              value={password}
              style={styles.textInput}
              secureTextEntry={isPwdHidden}
              activeOutlineColor={COLORS.primaryDark}
              right={
                <TextInput.Icon
                  icon={isPwdHidden ? 'eye' : 'eye-off'}
                  onPress={() => setIsPwdHidden(!isPwdHidden)}
                />
              }
              onChangeText={text => setPassword(text)}
            />
          </View>
          <View style={{flex: 1}}>
            <IconButton
              icon="arrow-right"
              disabled={isLoading}
              size={37}
              iconColor={COLORS.light}
              onPress={validateAndLogin}
              style={{
                width: 60,
                height: 60,
                borderRadius: 60 / 2,
                marginTop: 40,
                backgroundColor: COLORS.primary,
                marginLeft: 20,
              }}
            />
          </View>
        </View>

        <Text style={{alignSelf: 'center', margin: 10, color: '#555'}}>
          Version:{' '}
          {`${VersionNumber.buildVersion} (${VersionNumber.appVersion})`}
        </Text>
      </View>
    </>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  textInput: {
    marginVertical: 1,
    borderColor: '#2ecc71',
    zIndex: 999999, // works on ios
  },
  text: {
    alignSelf: 'center',

    fontSize: 20,
  },
  image: {
    height: 280,
    width: 280,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
});
