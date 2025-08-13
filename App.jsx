import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, Text, useTheme, MD3LightTheme, Icon } from 'react-native-paper';

import ProfileScreen from './src/screens/ProfileScreen';
import AttendanceScreen from './src/screens/AttendanceScreen';
import SalaryScreen from './src/screens/SalaryScreen';
import ViewGrievanceScreen from './src/screens/ViewGrievanceScreen';
import ApplyLeaveScreen from './src/screens/ApplyLeaveScreen';
import LeaveStatusScreen from './src/screens/LeaveStatusScreen';
import SuggestionScreen from './src/screens/SuggestionScreen';
import LoanScreen from './src/screens/LoanScreen';
import ViewLoanScreen from './src/screens/ViewLoanScreen';
import ViewGPFScreen from './src/screens/ViewGPFScreen';
import GrievanceScreen from './src/screens/GrievanceScreen';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const theme = useTheme();

  const drawerItems = [
    { label: 'Profile', icon: 'account-circle', screen: 'Profile' },
    { label: 'Attendance', icon: 'calendar-check', screen: 'Attendance' },
    { label: 'Salary', icon: 'currency-inr', screen: 'Salary' },
    { label: 'Grievance View', icon: 'file-eye', screen: 'ViewGrievance' },
    { label: 'Apply Leave', icon: 'calendar-plus', screen: 'ApplyLeave' },
    { label: 'Leave Status', icon: 'calendar-clock', screen: 'LeaveStatus' },
    { label: 'Suggestion', icon: 'lightbulb', screen: 'Suggestion' },
    { label: 'Loan', icon: 'bank', screen: 'Loan' },
    { label: 'View Loan', icon: 'bank-eye', screen: 'ViewLoan' },
    { label: 'View GPF', icon: 'file-cabinet', screen: 'ViewGPF' },
    { label: 'Grievance', icon: 'account-alert', screen: 'Grievance' },
  ];

  return (
    <DrawerContentScrollView {...props}>
      {/* Drawer Header */}
      <View style={styles.drawerHeader}>
        <Image
          source={{ uri: 'https://via.placeholder.com/80' }}
          style={styles.profileImage}
        />
        <Text variant="titleMedium" style={{ fontWeight: 'bold', marginTop: 8 }}>
          John Doe
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.primary }}>
          johndoe@email.com
        </Text>
      </View>

      {/* Drawer Items */}
      {drawerItems.map((item, index) => (
        <DrawerItem
          key={index}
          label={item.label}
          icon={({ color, size }) => (
            <Icon source={item.icon} size={size} color={color} />
          )}
          onPress={() => props.navigation.navigate(item.screen)}
        />
      ))}
    </DrawerContentScrollView>
  );
}

export default function App() {
  return (
    <PaperProvider theme={MD3LightTheme}>
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{
            headerStyle: { backgroundColor: '#1976d2' },
            headerTintColor: '#fff',
            drawerActiveTintColor: '#1976d2',
            drawerLabelStyle: { fontSize: 15 },
          }}
        >
          <Drawer.Screen name="Profile" component={ProfileScreen} />
          <Drawer.Screen name="Attendance" component={AttendanceScreen} />
          <Drawer.Screen name="Salary" component={SalaryScreen} />
          <Drawer.Screen name="ViewGrievance" component={ViewGrievanceScreen} />
          <Drawer.Screen name="ApplyLeave" component={ApplyLeaveScreen} />
          <Drawer.Screen name="LeaveStatus" component={LeaveStatusScreen} />
          <Drawer.Screen name="Suggestion" component={SuggestionScreen} />
          <Drawer.Screen name="Loan" component={LoanScreen} />
          <Drawer.Screen name="ViewLoan" component={ViewLoanScreen} />
          <Drawer.Screen name="ViewGPF" component={ViewGPFScreen} />
          <Drawer.Screen name="Grievance" component={GrievanceScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f1f1f1',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});