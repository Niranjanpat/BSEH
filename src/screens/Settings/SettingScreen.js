import MapplsIntouch from 'mappls-intouch-react-native';
import React from 'react';
import {View, StyleSheet, SafeAreaView, ScrollView, Alert} from 'react-native';
import MMKVStorage from 'react-native-mmkv-storage';
import {
  Avatar,
  Button,
  List,
  Subheading,
  Title,
} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {ROUTES} from '../../constants/routes';
import {COLORS} from '../../constants/theme/colors'; // Add this import

const mmkv = new MMKVStorage.Loader().initialize();

const SettingScreen = ({navigation}) => {
  const {profile, role, attendanceStatus} = useSelector(state => state.auth);

  const logout = () => {
    if (attendanceStatus) {
      Alert.alert('Denied', 'You must punch out before logging out');
      return;
    }

    mmkv.clearStore();
    navigation.replace(ROUTES.auth_stack);
    MapplsIntouch.stopTracking();
  };

  const renderItem = (title, icon, onPress) => (
    <List.Item
      style={styles.list}
      title={title}
      titleStyle={styles.listTitle}
      onPress={onPress}
      left={props => (
        <View style={styles.iconWrapper}>
          <List.Icon icon={icon} color={COLORS.primary} />
        </View>
      )}
      right={props => <List.Icon {...props} icon="chevron-right" />}
    />
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SafeAreaView />
      <View style={styles.profileDetail}>
        <Avatar.Text
          size={100}
          label={profile.name ? profile.name.charAt(0) : 'P'}
          style={{backgroundColor: COLORS.primary}}
        />
        <Title style={styles.title}>{profile.name}</Title>
        <Subheading style={styles.subheading}>{role}</Subheading>
        <Subheading style={styles.subheading}>
          {profile.contact_number}
        </Subheading>
        <Subheading style={styles.subheading}>{profile.email}</Subheading>
      </View>

      <View>
        {renderItem('Profile', 'account', () =>
          navigation.navigate(ROUTES.profile),
        )}
        {renderItem('Attendance', 'calendar-account-outline', () =>
          navigation.navigate(ROUTES.attendance),
        )}
        {renderItem('Monthly attendance', 'calendar-month-outline', () =>
          navigation.navigate(ROUTES.monthly_attendance),
        )}
        {renderItem('Monthly Travel Distance', 'calendar-month-outline', () =>
          navigation.navigate(ROUTES.monthly_attendance_travel),
        )}
          {renderItem('My Route schedules', 'map-marker-distance', () =>
          navigation.navigate(ROUTES.route_schedule_stack),
        )}
        {/* {(role === 'sc' ||
          role === 'kam' ||
          role === 'asm' ||
          role === 'promoter') && (
          <>
            {renderItem('Retailer Masters', 'bookmark-outline', () =>
              navigation.navigate(ROUTES.retailer_master),
            )}
            {role !== 'promoter' &&
              renderItem('Performance', 'star-outline', () =>
                navigation.navigate(ROUTES.performance),
              )}
          </>
        )} */}

        {renderItem('Retailer Masters', 'bookmark-outline', () =>
          navigation.navigate(ROUTES.retailer_master),
        )}
         {renderItem('Sample','flask-outline', () =>
          navigation.navigate(ROUTES.sample_stack,{screen:ROUTES.sample}),
        )}

        {
          renderItem('Cumulative report', 'account-details', () =>
            navigation.navigate(ROUTES.cumulative_report),
          )}
          {
              renderItem('Performance', 'star-outline', () =>
                navigation.navigate(ROUTES.performance),
              )}

        {/* {!['sales-officer', 'sc', 'promoter'].includes(role) && (
          <>
            {renderItem('User Hierarchy', 'file-tree-outline', () =>
              navigation.navigate(ROUTES.user_hierarchy_stack),
            )}
            {role === 'asm' &&
              renderItem('Retailer Masters', 'bookmark-outline', () =>
                navigation.navigate(ROUTES.retailer_master),
              )}
          </>
        )} */}

        {/* {role != 'sc' && (
          <>
            {renderItem('User Hierarchy', 'file-tree-outline', () =>
              navigation.navigate(ROUTES.user_hierarchy_stack),
            )}
          </>
        )} */}

        {role !== 'sc' &&
          renderItem('User Hierarchy', 'file-tree-outline', () =>
            navigation.navigate(ROUTES.user_hierarchy_stack),
          )}

        {/* {(role === 'sc' || role === 'kam') &&
          renderItem('Route schedules', 'map-marker-distance', () =>
            navigation.navigate(ROUTES.route_schedule_stack),
          )} */}

      

        {/* {!['sc', 'kam'].includes(role) &&
          renderItem('User route schedules', 'map-marker', () =>
            navigation.navigate(ROUTES.user_route_schedule_list),
          )} */}

        {role !== 'sc' && renderItem('Sub-Ordinate schedules', 'map-marker', () =>
          navigation.navigate(ROUTES.user_route_schedule_list),
        )}
         { renderItem('User Daily Attendance', 'map-marker', () =>
          navigation.navigate(ROUTES.daily_attendance),
        )}

        

        

        
        {renderItem('Expenses', 'cash-multiple', () =>
          navigation.navigate(ROUTES.expense_stack),
        )}

        {renderItem('Complaint', 'message-alert-outline', () =>
          navigation.navigate(ROUTES.complaint_stack),
        )}

        {role !== 'sc' && renderItem('Sub-Ordinate Complaint', 'account-alert', () =>
          navigation.navigate(ROUTES.user_complaint_stack),
        )}

        {renderItem('TADA', 'briefcase-outline', () =>
          navigation.navigate(ROUTES.ta_das_stack),
        )}
        {/* {renderItem('About Patanjali', 'office-building', () =>
          navigation.navigate(ROUTES.about),
        )} */}

        {renderItem('About Us', 'information-outline', () =>
          navigation.navigate(ROUTES.aboutus),
        )}

        <Button
          icon="logout"
          style={styles.logout}
          mode="contained"
          onPress={logout}>
          Logout
        </Button>
      </View>
    </ScrollView>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  logout: {
    marginVertical: 20,
    backgroundColor: COLORS.primary,
  },
  profileDetail: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  list: {
    backgroundColor: '#ffffff',
    paddingVertical: 0,
    paddingLeft:6,
    borderRadius: 10,
    marginVertical: 3,
    marginHorizontal: 0,
    elevation: 0.5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  listTitle: {
    fontWeight: 700,
    color: '#212121',
  },
  iconWrapper: {
    backgroundColor: '#f1f9fe', // Optional: Replace with a derived light primary color if needed
    borderRadius: 10,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#212121',
    fontWeight: 'bold',
    marginTop: 8,
  },
  subheading: {
    color: '#424242',
  },
});
