import React, {useCallback, useState} from 'react';
import dayjs from 'dayjs';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Appbar,
  Avatar,
  Button,
  Caption,
  Subheading,
  Text,
  Title,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';

import {ROUTES} from '../../constants/routes';
import {COLORS} from '../../constants/theme/colors';
import {SPACINGS} from '../../constants/theme';
import {profile} from '../../services/auth_service';
import {storeAccount} from '../../store/actions/auth';

const ProfileScreen = ({navigation}) => {
  const {profile: userDetails, role} = useSelector(state => state.auth);

  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    profile()
      .then(res => {
        const {data, errors, success} = res.data;
        if (success) {
          dispatch(storeAccount(data));
        } else {
          if (errors) {
            Alert.alert('Error!', Object.values(errors).join(', '));
          }
        }
      })
      .catch(e => {
        console.log('getProfileDetail', e);
      })
      .finally(() => setRefreshing(false));
  }, []);

  const handleEditPressed = () => {
    navigation.navigate(ROUTES.update_profile);
  };

  console.log('profile', userDetails);

  const profileFields = {
    'Emp Code': userDetails?.emp_code || '',
    'E-mail': userDetails?.email || '',
    'Contact Number': userDetails?.contact_number || '',
    DOB: dayjs(userDetails?.date_of_birth).format('DD-MM-YYYY') || '',
    Gender: userDetails?.gender || '',
    Region: userDetails?.region_name || '',
    State: userDetails?.state_name || '',
    Headquarters: userDetails?.headquarters_name || '',
    'Join Date': dayjs(userDetails?.join_date).format('DD-MM-YYYY') || '',
    // Address: userDetails?.address || '',
    'Aadhar Number': userDetails?.aadhar_number || '',
    'PAN Number': userDetails?.pan_number || '',
    // 'Emergency Contact Name': userDetails?.emergency_contact_name || '',
    'Emergency Contact Number': userDetails?.emergency_contact_number || '',
    'Last Working Day': dayjs(userDetails?.last_working_day).isValid() ? dayjs(userDetails?.last_working_day).format('DD-MM-YYYY') : '',
  };

  return (
    <>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Profile" />
      </Appbar.Header>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.profileCard}>
          <Avatar.Text
            style={styles.avatar}
            size={80}
            label={userDetails?.name ? userDetails.name.charAt(0) : 'P'}
            color="#fff"
          />
          <Title style={styles.name}>{userDetails?.name || 'User'}</Title>
          <Caption style={styles.role}>{role || ''}</Caption>
        </View>

        <View style={styles.detailsContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Subheading style={styles.sectionTitle}>Profile Info</Subheading>
            <Button
              style={styles.editButton}
              mode="contained"
              icon="account-edit"
              onPress={handleEditPressed}></Button>
          </View>

          <View style={styles.dictionaryContainer}>
            {Object.entries(profileFields).map(([key, value]) => (
              <View style={styles.fieldRow} key={key}>
                <Text style={styles.fieldLabel}>{key}:</Text>
                <Text
                  style={
                    value === '' ? styles.notAvailableValue : styles.fieldValue
                  }>
                  {value}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background || '#f5f7fa',
  },
  appbar: {
    elevation: 0,
    backgroundColor: '#fff',
  },
  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: SPACINGS.sm,
    marginTop: SPACINGS.md,
    padding: SPACINGS.sm,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  avatar: {
    backgroundColor: COLORS.primary,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textDark || '#212121',
  },
  role: {
    fontSize: 14,
    color: COLORS.textLight || '#757575',
  },
  detailsContainer: {
    paddingHorizontal: SPACINGS.sm,
    paddingVertical: SPACINGS.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACINGS.sm,
  },
  dictionaryContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: SPACINGS.md,
    // Optional shadow for subtle elevation:
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    // elevation: 2,
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: SPACINGS.sm,
    flexWrap: 'wrap',
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textLight || '#777',
    marginRight: 8,
  },
  fieldValue: {
    fontSize: 15,
    fontWeight: '400',
    color: COLORS.textDark || '#222',
    flexShrink: 1,
  },
  notAvailableValue: {
    fontSize: 15,
    fontWeight: '400',
    fontStyle: 'italic',
    color: '#b0bec5',
    flexShrink: 1,
  },
  editButton: {
    marginBottom: SPACINGS.sm,
    backgroundColor: COLORS.primary,
  },
});
