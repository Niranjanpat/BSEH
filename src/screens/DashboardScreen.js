import React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const DashboardScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const menuItems = [
    { title: 'Profile', icon: 'account-circle', route: 'ProfileScreen' },
    { title: 'Attendance', icon: 'calendar-check', route: 'AttendanceScreen' },
    { title: 'Salary', icon: 'currency-inr', route: 'SalaryScreen' },
    { title: 'Grievance View', icon: 'file-eye', route: 'ViewGrievanceScreen' },
    { title: 'Apply Leave', icon: 'calendar-plus', route: 'ApplyLeaveScreen' },
    { title: 'Leave Status', icon: 'calendar-clock', route: 'LeaveStatusScreen' },
    { title: 'Suggestion', icon: 'lightbulb', route: 'SuggestionScreen' },
    { title: 'Loan', icon: 'bank', route: 'LoanScreen' },
    { title: 'View Loan', icon: 'bank-eye', route: 'ViewLoanScreen' },
    { title: 'View GPF', icon: 'file-cabinet', route: 'ViewGPFScreen' },
    { title: 'Grievance', icon: 'account-alert', route: 'GrievanceScreen' },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cardWrapper}
      onPress={() => navigation.navigate(item.route)}
    >
      <Card style={styles.card}>
        <View style={styles.iconContainer}>
          <Icon name={item.icon} size={40} color={theme.colors.primary} />
        </View>
        <Text style={styles.title}>{item.title}</Text>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={menuItems}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        renderItem={renderItem}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  grid: {
    alignItems: 'center',
  },
  cardWrapper: {
    flex: 1,
    margin: 8,
    maxWidth: '30%',
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: '#fff',
  },
  iconContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default DashboardScreen;