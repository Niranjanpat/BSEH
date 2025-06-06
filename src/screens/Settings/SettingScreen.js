import MapplsIntouch from 'mappls-intouch-react-native';
import React from 'react';
import {View, StyleSheet, SafeAreaView, ScrollView, Alert} from 'react-native';
import MMKVStorage from 'react-native-mmkv-storage';
import {
  Avatar,
  Button,
  Divider,
  List,
  Subheading,
  Title,
} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {ROUTES} from '../../constants/routes';

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
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SafeAreaView />
      <View style={styles.profileDetail}>
        <Avatar.Text
          size={100}
          label={profile.name ? profile.name.charAt(0) : 'P'}
        />
        <Title>{profile.name}</Title>
        <Subheading>{role}</Subheading>
        <Subheading>{profile.contact_number}</Subheading>
        <Subheading>{profile.email}</Subheading>
      </View>
      <View>
        <List.Item
          style={styles.list}
          title="Profile"
          onPress={() => {
            navigation.navigate(ROUTES.profile);
          }}
          left={props => <List.Icon {...props} icon="account" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <Divider />
        <Divider />

        {(role === 'sc' ||
          role === 'kam' ||
          role === 'asm' ||
          role === 'promoter') && (
          <>
            <List.Item
              style={styles.list}
              title="Retailer Masters"
              onPress={() => {
                navigation.navigate(ROUTES.retailer_master);
              }}
              left={props => <List.Icon {...props} icon="bookmark-outline" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
            <Divider />
            <Divider />
            {role !== 'promoter' && (
              <List.Item
                style={styles.list}
                title="Performance"
                onPress={() => {
                  navigation.navigate(ROUTES.performance);
                }}
                left={props => <List.Icon {...props} icon="star-outline" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
              />
            )}
            <Divider />
            <Divider />
          </>
        )}
        {/* {role === 'kam' && (
          <>
            <List.Item
              style={styles.list}
              title="Today's report"
              onPress={() => {
                navigation.navigate(ROUTES.today_report, {id: null});
              }}
              left={props => <List.Icon {...props} icon="chart-line" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
            <Divider />
          </>
        )} */}
        {role !== 'sc' && (
          <>
            <List.Item
              style={styles.list}
              title="Cumulative report"
              onPress={() => {
                navigation.navigate(ROUTES.cumulative_report);
              }}
              left={props => <List.Icon {...props} icon="account-details" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
            <Divider />
          </>
        )}
        {!(
          role === 'sales-officer' ||
          role === 'sc' ||
          role === 'promoter'
        ) && (
          <>
            <List.Item
              style={styles.list}
              title="User Hierarchy"
              onPress={() => {
                navigation.navigate(ROUTES.user_hierarchy_stack);
              }}
              left={props => <List.Icon {...props} icon="file-tree-outline" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
            <Divider />
            {role === 'asm' && (
              <List.Item
                style={styles.list}
                title="Retailer Masters"
                onPress={() => {
                  navigation.navigate(ROUTES.retailer_master);
                }}
                left={props => <List.Icon {...props} icon="bookmark-outline" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
              />
            )}
            {/* 
            {role !== 'promoter' && (
              <>
                <Divider />
                <List.Item
                  style={styles.list}
                  title="Joint Work List"
                  onPress={() => {
                    navigation.navigate(ROUTES.my_joint_work);
                  }}
                  left={props => <List.Icon {...props} icon="handshake" />}
                  right={props => <List.Icon {...props} icon="chevron-right" />}
                />
                <Divider />
              </>
            )}
            {!(role === 'kam' || role === 'dsm' || role === 'promoter') && (
              <>
                <Divider />
                <List.Item
                  style={styles.list}
                  title="Joint Work Tracking"
                  onPress={() => {
                    navigation.navigate(ROUTES.joint_stack);
                  }}
                  left={props => (
                    <List.Icon {...props} icon="account-multiple" />
                  )}
                  right={props => <List.Icon {...props} icon="chevron-right" />}
                />
                <Divider />
              </>
            )}
            <Divider />

            <List.Item
              style={styles.list}
              title="Tracking"
              onPress={() => {
                navigation.navigate(ROUTES.tracking_stack);
              }}
              left={props => <List.Icon {...props} icon="map-search-outline" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
            <Divider />
            {/* <Divider /> */}
          </>
        )}
        <Divider />
        {(role === 'sc' || role === 'kam') && (
          <>
            <List.Item
              style={styles.list}
              title="Route schedules"
              onPress={() => {
                navigation.navigate(ROUTES.route_schedule_stack);
              }}
              left={props => (
                <List.Icon {...props} icon="map-marker-distance" />
              )}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
            <Divider />
          </>
        )}

        {!(role === 'sc' || role === 'kam') && (
          <>
            <Divider />
            <List.Item
              style={styles.list}
              title="User route schedules"
              onPress={() => {
                navigation.navigate(ROUTES.user_route_schedule_list);
              }}
              left={props => <List.Icon {...props} icon="map-marker" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
            <Divider />
          </>
        )}
        <List.Item
          style={styles.list}
          title="Attendance"
          onPress={() => {
            navigation.navigate(ROUTES.attendance);
          }}
          left={props => (
            <List.Icon {...props} icon="calendar-account-outline" />
          )}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <Divider />
        <Divider />

        <List.Item
          style={styles.list}
          title="Monthly attendance"
          onPress={() => {
            navigation.navigate(ROUTES.monthly_attendance);
          }}
          left={props => <List.Icon {...props} icon="calendar-month-outline" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <Divider />
        <Divider />

        <List.Item
          style={styles.list}
          title="Monthly Travel Distance"
          onPress={() => {
            navigation.navigate(ROUTES.monthly_attendance_travel);
          }}
          left={props => <List.Icon {...props} icon="calendar-month-outline" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />

        <Divider />
        <Divider />

        <List.Item
          style={styles.list}
          title="Expenses"
          onPress={() => {
            navigation.navigate(ROUTES.expenses);
          }}
          left={props => <List.Icon {...props} icon="cash-multiple" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <Divider />
        <Divider />
        <List.Item
          style={styles.list}
          title="Add Expenses"
          onPress={() => {
            navigation.navigate(ROUTES.add_expenses, {
              channel: 'add',
              expenseDetail: null,
              id: null,
            });
          }}
          left={props => <List.Icon {...props} icon="wallet-plus-outline" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />

        <Divider />
        <Divider />
        <List.Item
          style={styles.list}
          title="Complaint"
          onPress={() => {
            navigation.navigate(ROUTES.complaint);
          }}
          left={props => <List.Icon {...props} icon="message-alert-outline" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <Divider />
        <Divider />
        <List.Item
          style={styles.list}
          title="Add Complaint"
          onPress={() => {
            navigation.navigate(ROUTES.add_complaint, {
              channel: 'add',
              complaint: null,
            });
          }}
          left={props => <List.Icon {...props} icon="calendar-month-outline" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <Divider />
        <Divider />
        <List.Item
          style={styles.list}
          title="About Patanjali"
          onPress={() => {
            navigation.navigate(ROUTES.about);
          }}
          left={props => <List.Icon {...props} icon="office-building" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <Divider />
        <Divider />

        <List.Item
          style={styles.list}
          title="About Us"
          onPress={() => {
            navigation.navigate(ROUTES.aboutus);
          }}
          left={props => <List.Icon {...props} icon="information-outline" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <Divider />

        <Button
          icon="logout"
          style={styles.logout}
          mode="contained"
          onPress={() => logout()}>
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
  },
  logout: {
    marginVertical: 20,
    backgroundColor: '#e74c3c',
    color: '#fff',
  },
  profileDetail: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  list: {
    backgroundColor: '#fff',
  },
});
