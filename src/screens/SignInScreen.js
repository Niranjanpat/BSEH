import React, {useRef, useState} from 'react';
import {Alert, Image, Keyboard, ScrollView, ScrollViewBase,KeyboardAvoidingView, StyleSheet, View} from 'react-native';
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

const mmkv = new MMKVStorage.Loader().initialize();
const SignInScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const emailRef = useRef();
  const passwordRef = useRef();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPwdHidden, setIsPwdHidden] = useState(true);

  const validateAndLogin = () => {
    if (email === '') {
      emailRef.current.focus();
      return;
    }
    if (password === '') {
      passwordRef.current.focus();
      return;
    }

    onSumbit();
  };

  const onSumbit = () => {
    Keyboard.dismiss();
    setIsLoading(true);

    login(email, password)
      .then(res => {
        const {data, success, errors} = res.data;

        if (success) {
          console.log('user', data);
          mmkv.setString('token', data.token);
          mmkv.setString('role', data.role);
          dispatch(storeRole(data.role));
          dispatch(storeToken(data.token));
          dispatch(getProfileDetail());
          if (data.role == 'sales-officer' || data.role == 'kam') {
            dispatch(getRetailerList());
          } else {
            dispatch(fetchJointWorkStatus());
          }
          dispatch(getAttendanceStatus());
          dispatch(initOrderCart());
          setIsLoading(false);
          navigation.replace(ROUTES.bottomtab_stack);
        } else {
          setIsLoading(false);

          if (errors?.email) {
            Alert.alert('Fail', errors.email);
            return;
          }
        }
      })
      .catch(e => {
        setIsLoading(false);
        console.log(e);
        Alert.alert('Error', e.toString());
      });
  };

  return (
    <>
      <Wave1 />
      
        <ScrollView   contentContainerStyle={{
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 60,}}>
        <Image source={IMAGE.logo_ruchi} style={styles.image} />
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
              color={COLORS.light}
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
      </ScrollView>
     
      
      <Wave2 style={{zIndex: -100000}} />
    </>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
   // justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 60,
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
    height: 180,
    width: 180,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
});
