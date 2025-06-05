import React from 'react';
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

  // Prepare dictionary object with profile fields
  const profileFields = {
    Address: profile?.address || 'N/A',
    'Contact Number': profile?.contact_number || 'N/A',
    DOB: profile?.date_of_birth || 'N/A',
    'E-mail': profile?.email || 'N/A',
    'Emp Code': profile?.emp_code || 'N/A',
    Gender: profile?.gender || 'N/A',
    Verticals: profile?.verticals || 'N/A',
  };

  return (
    <ScrollView style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Profile" />
      </Appbar.Header>

      <View style={styles.profileCard}>
        <Button
          style={styles.editButton}
          mode="contained"
          icon="account-edit"
          onPress={handleEditPressed}>
          Edit Profile
        </Button>
        <Avatar.Text
          style={styles.avatar}
          size={100}
          label={profile?.name ? profile.name.charAt(0) : 'P'}
          color="#fff"
        />
        <Title style={styles.name}>{profile?.name || 'User'}</Title>
        <Caption style={styles.role}>{role || 'N/A'}</Caption>
      </View>

      <View style={styles.detailsContainer}>
        <Subheading style={styles.sectionTitle}>Profile Info</Subheading>

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
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: SPACINGS.lg,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: SPACINGS.md,
  },
  avatar: {
    backgroundColor: COLORS.primary,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textDark || '#212121',
    marginTop: 10,
  },
  role: {
    fontSize: 14,
    color: COLORS.textLight || '#757575',
    marginTop: 2,
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
    alignSelf: 'flex-end',
    marginBottom: SPACINGS.md,
    backgroundColor: COLORS.primary,
    marginRight:SPACINGS.sm,
  },
});
