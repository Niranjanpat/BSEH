import React from 'react';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {
  Appbar,
  Avatar,
  Button,
  Caption,
  Divider,
  Subheading,
  Text,
  Title,
} from 'react-native-paper';
import {useSelector} from 'react-redux';
import VerticalSpacer from '../../components/VerticalSpacer';

import {ROUTES} from '../../constants/routes';
import {COLORS} from '../../constants/theme/colors';
import {SPACINGS, TYPOGRAPHY} from '../../constants/theme';

const ProfileScreen = ({navigation}) => {
  const {profile, role} = useSelector(state => state.auth);

  const handleEditPressed = () => {
    navigation.navigate(ROUTES.update_profile);
  };

  return (
    <ScrollView style={styles.container}>
      <Appbar.Header theme={{colors: {primary: COLORS.light}}}>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Appbar.Content title="Profile" />
      </Appbar.Header>
      <View style={styles.imgContainer}>
        <Avatar.Text
          style={styles.avater}
          size={100}
          label={profile.name ? profile.name.charAt(0) : 'P'}
        />
      </View>
      <View style={styles.retailerBasicDetails}>
        <Title numberOfLines={1}>{profile.name}</Title>
        <Caption>{role}</Caption>
      </View>

      <View style={styles.detailsContainer}>
        <ScrollView
          contentContainerStyle={styles.bottomDetailsContentContainer}
          showsVerticalScrollIndicator={false}>
          <Button
            style={styles.btnEdit}
            compact
            mode="contained"
            onPress={handleEditPressed}
            icon={'account-edit'}>
            Edit
          </Button>
          <Subheading>Profile Info:</Subheading>
          <Divider />
          <VerticalSpacer />
          <View style={styles.row}>
            <Text style={styles.detailsTitle}>Address</Text>
            <Text> : </Text>
            {profile?.address ? (
              <Text style={styles.detailsValue}>{profile?.address}</Text>
            ) : (
              <Text style={styles.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={styles.row}>
            <Text style={styles.detailsTitle}>Contact Number</Text>
            <Text> : </Text>
            {profile?.contact_number ? (
              <Text style={styles.detailsValue}>{profile?.contact_number}</Text>
            ) : (
              <Text style={styles.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={styles.row}>
            <Text style={styles.detailsTitle}>DOB</Text>
            <Text> : </Text>
            {profile?.date_of_birth ? (
              <Text style={styles.detailsValue}>{profile?.date_of_birth}</Text>
            ) : (
              <Text style={styles.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={styles.row}>
            <Text style={styles.detailsTitle}>E-mail</Text>
            <Text> : </Text>
            {profile?.email ? (
              <Text style={styles.detailsValue}>{profile?.email}</Text>
            ) : (
              <Text style={styles.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={styles.row}>
            <Text style={styles.detailsTitle}>Emp Code</Text>
            <Text> : </Text>
            {profile?.emp_code ? (
              <Text style={styles.detailsValue}>{profile?.emp_code}</Text>
            ) : (
              <Text style={styles.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={styles.row}>
            <Text style={styles.detailsTitle}>Gender</Text>
            <Text> : </Text>
            {profile?.gender ? (
              <Text style={styles.detailsValue}>{profile?.gender}</Text>
            ) : (
              <Text style={styles.notAvailableTxt}>N/A</Text>
            )}
          </View>
          <View style={styles.row}>
            <Text style={styles.detailsTitle}>Verticals</Text>
            <Text> : </Text>
            {profile?.verticals ? (
              <Text style={styles.detailsValue}>{profile?.verticals}</Text>
            ) : (
              <Text style={styles.notAvailableTxt}>N/A</Text>
            )}
          </View>

          <Divider />
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const size = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnEdit: {
    alignSelf: 'flex-end',
  },
  avater: {
    alignSelf: 'center',
  },
  imgContainer: {
    borderRadius: 5,
    overflow: 'hidden',
    padding: SPACINGS.xxs,
    marginTop: SPACINGS.sm,
    // backgroundColor: COLORS.light,
  },

  retailerBasicDetails: {
    alignItems: 'center',
    padding: SPACINGS.xs,
  },

  buttonGroupStyle: {
    alignSelf: 'center',
    maxHeight: size.width * 0.12,
    marginBottom: SPACINGS.sm,
  },

  buttonGroupContentContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: SPACINGS.md,
  },

  bottomButtonGroup: {
    width: size.width,
    flexDirection: 'row',
  },

  detailsContainer: {
    flex: 1,
    overflow: 'hidden',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: '#cfd8dc',
    width: size.width,
  },

  bottomDetailsContentContainer: {
    padding: SPACINGS.md,
  },

  row: {
    flexDirection: 'row',
    marginBottom: SPACINGS.sm,
    flex: 1,
  },

  detailsTitle: {
    ...TYPOGRAPHY.caption,
    width: size.width * 0.22,
    color: COLORS.accentSecondary,
  },

  detailsValue: {
    flex: 1,
  },

  notAvailableTxt: {
    color: COLORS.accentPrimary,
  },

  button: {
    padding: SPACINGS.sm,
  },
});
