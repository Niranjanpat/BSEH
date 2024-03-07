import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Divider, List, Text} from 'react-native-paper';
import {ROUTES} from '../../../constants/routes';

const PerformanceScreen = ({navigation, route}) => {
  const {role, id} = route.params;
  console.log(role);
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.textStyle}>Performance</Text>
      <List.Item
        style={styles.list}
        title="Daily Order"
        onPress={() => {
          navigation.navigate(ROUTES.daily_order, {id, role});
        }}
        left={props => <List.Icon {...props} icon="cart-outline" />}
        right={props => <List.Icon {...props} icon="chevron-right" />}
      />
      <Divider />

      <Divider />
      <List.Item
        style={styles.list}
        title="Today Order"
        onPress={() => {
          navigation.navigate(ROUTES.today_customer_order, {id, role});
        }}
        left={props => <List.Icon {...props} icon="cart-outline" />}
        right={props => <List.Icon {...props} icon="chevron-right" />}
      />
      <Divider />

      <Divider />
      <List.Item
        style={styles.list}
        title="Top Customers"
        onPress={() => {
          navigation.navigate(ROUTES.top_customers, {id, role});
        }}
        left={props => <List.Icon {...props} icon="map-marker-check-outline" />}
        right={props => <List.Icon {...props} icon="chevron-right" />}
      />
      <Divider />

      <Divider />
      <List.Item
        style={styles.list}
        title="Customer Order"
        onPress={() => {
          navigation.navigate(ROUTES.customer_order, {id, role});
        }}
        left={props => <List.Icon {...props} icon="cart-remove" />}
        right={props => <List.Icon {...props} icon="chevron-right" />}
      />
      <Divider />

      {(role === 'dsm' || role === 'kam') && (
        <>
          <Divider />
          <List.Item
            style={styles.list}
            title="User Targets"
            onPress={() => {
              navigation.navigate(ROUTES.user_target, {id, role});
            }}
            left={props => <List.Icon {...props} icon="cart-arrow-up" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />

          <List.Item
            style={styles.list}
            title="Order Log"
            onPress={() => {
              navigation.navigate(ROUTES.order_log_performance, {role, id});
            }}
            left={props => <List.Icon {...props} icon="cart-outline" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
        </>
      )}

      {role !== 'kam' && (
        <>
          <Divider />
          <List.Item
            style={styles.list}
            title="Top KAMs"
            onPress={() => {
              navigation.navigate(ROUTES.top_dsm, {id});
            }}
            left={props => <List.Icon {...props} icon="cart-arrow-up" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />

          <Divider />
          <List.Item
            style={styles.list}
            title="Top Distributors"
            onPress={() => {
              navigation.navigate(ROUTES.top_Distributors, {id});
            }}
            left={props => <List.Icon {...props} icon="map-legend" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
        </>
      )}
      {/* 
      {role !== 'kam' && role !== 'sales-officer' && (
        <>
          <Divider />
          <List.Item
            style={styles.list}
            title="Top Sales Officer"
            onPress={() => {
              navigation.navigate(ROUTES.top_so, {id});
            }}
            left={props => <List.Icon {...props} icon="cart-remove" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
        </>
      )} */}
      {(role == 'kam' || role == 'dsm') && (
        <>
          <Divider />
          <List.Item
            style={styles.list}
            title="Beats"
            onPress={() => {
              navigation.navigate(ROUTES.user_beat, {id});
            }}
            left={props => <List.Icon {...props} icon="cart-remove" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
        </>
      )}

      {role === 'kam' && (
        <>
          <List.Item
            style={styles.list}
            title="Today's Report"
            onPress={() => {
              navigation.navigate(ROUTES.today_report, {role, id});
            }}
            left={props => <List.Icon {...props} icon="chart-line" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
          <List.Item
            style={styles.list}
            title="Daywise Compliance Report"
            onPress={() => {
              navigation.navigate(ROUTES.day_wise_report, {role, id});
            }}
            left={props => <List.Icon {...props} icon="chart-multiple" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
        </>
      )}
    </ScrollView>
  );
};

export default PerformanceScreen;
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  textStyle: {
    marginVertical: 10,
  },
  list: {
    backgroundColor: '#fff',
  },
});
