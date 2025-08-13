import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import MMKV from 'react-native-mmkv-storage';
import {Text, View, StyleSheet, Image, StatusBar} from 'react-native';

import {IMAGE} from '../constants/images';
import {COLORS} from '../constants/theme/colors';
import {
  fetchJointWorkStatus,
  getAttendanceStatus,
  getProfileDetail,
  storeRole,
  storeToken,
} from '../store/actions/auth';
import {getRetailerList} from '../store/actions/retailer';
import {initOrderCart} from '../store/actions/cart';

const mmkv = new MMKV.Loader().initialize();
const SplashScreen = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const token = mmkv.getString('token');

    if (token) {
      const role = mmkv.getString('role');
      dispatch(storeRole(role));
      dispatch(storeToken(token));
      dispatch(getProfileDetail());
      if (role == 'asm' || role == 'sc') {
        // dispatch(getRetailerList());
      } else {
        dispatch(fetchJointWorkStatus());
      }

      dispatch(getAttendanceStatus());
      dispatch(initOrderCart());
    }
  };

  return (
    <View style={styles.container}>
      {/* <StatusBar backgroundColor={"#fbf5e9"} /> */}
      <Image style={styles.coverImage} source={IMAGE.logo_ruchi} />

      {/* <Text style={styles.text}>विकल्प रहित संकल्प ।</Text>
      <Text style={styles.text}>अखण्ड, प्रचण्ड पुरुषार्थ ।</Text>

      <View style={styles.textView} />
      <Text style={styles.text}>वपतंजलि स्वावलंबन अभियान</Text>
      <Text style={styles.text}>अखण्ड, प्रचण्ड पुरुषार्थ ।</Text>

      <View style={styles.textView} />
      <Text style={styles.text}>स्वदेशी से स्वावलंबी</Text> */}
    </View>
  );
};
export default SplashScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textView: {
    borderBottomWidth: 1,
    width: '40%',
    borderColor: COLORS.accentPrimary,
    marginTop: 15,
    marginBottom: 15,
  },
  text: {
    color: COLORS.accentSecondary,
    marginTop: 5,
  },

  coverImage: {
    height: 300,
    width: 400,
    resizeMode: 'contain',
  },
});
