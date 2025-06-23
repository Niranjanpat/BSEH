import React from 'react';
import dayjs from 'dayjs';
import {ScrollView, StyleSheet, View} from 'react-native';
import {
  Appbar,
  Avatar,
  Button,
  Caption,
  Subheading,
  Text,
  Title,
} from 'react-native-paper';
import {useSelector} from 'react-redux';

import {ROUTES} from '../../constants/routes';
import {COLORS} from '../../constants/theme/colors';
import {SPACINGS} from '../../constants/theme';

const ProfileScreen = ({navigation}) => {
  const {profile, role} = useSelector(state => state.auth);

  const handleEditPressed = () => {
    navigation.navigate(ROUTES.update_profile);
  };

  console.log("profile", profile);

  // Prepare dictionary object with updated profile fields
  const profileFields = {
    'Emp Code': profile?.emp_code || 'N/A',
    'E-mail': profile?.email || 'N/A',
    'Contact Number': profile?.contact_number || 'N/A',
    DOB:dayjs(profile?.date_of_birth).format('DD-MM-YYYY') || 'N/A',
    Gender: profile?.gender || 'N/A',
    Region: profile?.region_name || 'N/A',
    State: profile?.state_name || 'N/A',
    Headquarters: profile?.headquarters_name || 'N/A',
    'Join Date': dayjs(profile?.join_date).format('DD-MM-YYYY') || 'N/A',
    Address: profile?.address || 'N/A',
    'Aadhar Number': profile?.aadhar_number || 'N/A',
    'PAN Number': profile?.pan_number || 'N/A',
    'Emergency Contact Name': profile?.emergency_contact_name || 'N/A',
    'Emergency Contact Number': profile?.emergency_contact_number || 'N/A',
    'Last Working Day': profile?.last_working_day || 'N/A',
  };

  return (
    <ScrollView style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Profile" />
      </Appbar.Header>

      <View style={styles.profileCard}>
        <Avatar.Text
          style={styles.avatar}
          size={80}
          label={profile?.name ? profile.name.charAt(0) : 'P'}
          color="#fff"
        />
        <Title style={styles.name}>{profile?.name || 'User'}</Title>
        <Caption style={styles.role}>{role || 'N/A'}</Caption>
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
                  value === 'N/A' ? styles.notAvailableValue : styles.fieldValue
                }>
                {value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
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
    marginHorizontal: SPACINGS.lg,
    marginTop: SPACINGS.md,
    paddingVertical: SPACINGS.sm,
    paddingHorizontal:SPACINGS.sm,
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
    paddingHorizontal: SPACINGS.lg,
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
