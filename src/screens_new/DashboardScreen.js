import React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Card, Text, useTheme, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/theme/colors';
import { ROUTES } from '../constants/routes';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 3 - 20;

const DashboardScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const menuItems = [
    { title: 'Profile', icon: 'account-circle', route: ROUTES.profile },
    { title: 'Attendance', icon: 'calendar-check', route: ROUTES.attendance },
    { title: 'Salary', icon: 'currency-rupee', route: ROUTES.salary },
    // { title: 'Grievance View', icon: 'file-eye-outline', route: ROUTES.grievance_view },
    { title: 'Apply Leave', icon: 'calendar-plus', route: ROUTES.apply_leave },
    { title: 'Leave Status', icon: 'calendar-clock', route: ROUTES.leave_status },
    // { title: 'Suggestion', icon: 'lightbulb-outline', route: ROUTES.suggestion },
    { title: 'Loan', icon: 'bank-outline', route: ROUTES.loan },
    { title: 'View Loan', icon: 'bank-check', route: ROUTES.view_loan },
    { title: 'View GPF', icon: 'file-document-outline', route: ROUTES.view_gpf },
    // { title: 'Grievance', icon: 'alert-circle-outline', route: ROUTES.grievance },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cardWrapper}
      onPress={() => navigation.navigate(item.route)}
    >
      <Card style={styles.card} mode="elevated">
        <IconButton
          icon={item.icon}
          size={32}
          iconColor={theme.colors.primary}
          style={styles.icon}
        />
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
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 10,
  },
  grid: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  cardWrapper: {
    width: ITEM_WIDTH,
    margin: 5,
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: '#fff',
  },
  icon: {
    marginBottom: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
});

export default DashboardScreen;
