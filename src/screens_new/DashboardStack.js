import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants/routes';
import DashboardScreen from './DashboardScreen';
import ProfileScreen from './ProfileScreen';
import AttendanceScreen from './AttendanceScreen';
import SalaryScreen from './SalaryScreen';
import ViewGrievanceScreen from './ViewGrienvanceScreen';
import ApplyLeaveScreen from './ApplyLeaveScreen';
import ViewLeaveScreen from './LeaveStatusScreen';
import SuggestionScreen from './SuggestionScreen';
import LoanScreen from './LoanScreen'
import ViewLoanScreen from './ViewLoanScreen';
import ViewGpaScreen from './ViewGPFScreen';
import GrievanceScreen from './GrievanceScreen';

const Stack = createNativeStackNavigator();

export default function DashboardStack() {
  return (
    <Stack.Navigator initialRouteName={ROUTES.dashboard}>
      <Stack.Screen name={ROUTES.dashboard} component={DashboardScreen} options={{title: 'Dashboard'}}/>
      <Stack.Screen name={ROUTES.profile} component={ProfileScreen} options={{title: 'Profile'}}/>
      <Stack.Screen name={ROUTES.attendance} component={AttendanceScreen} options={{title: 'Attendance'}}/>
      <Stack.Screen name={ROUTES.salary} component={SalaryScreen} options={{title: 'Salary'}}/>
      <Stack.Screen name={ROUTES.grievance_view} component={ViewGrievanceScreen} options={{title: 'View Grievance'}}/>
      <Stack.Screen name={ROUTES.apply_leave} component={ApplyLeaveScreen} options={{title: 'Apply Leave'}}/>
      <Stack.Screen name={ROUTES.leave_status} component={ViewLeaveScreen} options={{title: 'View Leave'}}/>
      <Stack.Screen name={ROUTES.suggestion} component={SuggestionScreen} options={{title: 'Suggestion'}}/>
      <Stack.Screen name={ROUTES.loan} component={LoanScreen} options={{title: 'Loan'}}/>
      <Stack.Screen name={ROUTES.view_loan} component={ViewLoanScreen} options={{title: 'View Loan'}}/>
      <Stack.Screen name={ROUTES.view_gpf} component={ViewGpaScreen} options={{title: 'View GPF'}}/>
      <Stack.Screen name={ROUTES.grievance} component={GrievanceScreen} options={{title: 'Apply Grievance'}}/>
    </Stack.Navigator>
  );
}
