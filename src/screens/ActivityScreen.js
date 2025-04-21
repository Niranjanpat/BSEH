import React from 'react';
import {StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import {Divider, List, Text} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {ROUTES} from '../constants/routes';

const ActivityScreen = ({navigation}) => {
  const {role} = useSelector(state => state.auth);
  return (
    <ScrollView style={styles.container}>
      <SafeAreaView />
      <Text style={styles.textStyle}>Today's Activities</Text>
      {role !== 'promoter' && (
        <>
          <List.Item
            style={styles.list}
            title="Orders"
            onPress={() => {
              navigation.navigate(ROUTES.order_screeen);
            }}
            left={props => <List.Icon {...props} icon="cart-outline" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
          <Divider />
        </>
      )}
      {/* <List.Item
        style={styles.list}
        title="Route Map"
        onPress={() => {
          navigation.navigate(ROUTES.route_map);
        }}
        left={props => <List.Icon {...props} icon="map-legend" />}
        right={props => <List.Icon {...props} icon="chevron-right" />}
      />
      <Divider />
      <Divider /> */}
      <List.Item
        style={styles.list}
        title="Total Visited"
        onPress={() => {
          navigation.navigate(ROUTES.total_visited);
        }}
        left={props => <List.Icon {...props} icon="map-marker-check-outline" />}
        right={props => <List.Icon {...props} icon="chevron-right" />}
      />
      <Divider />
      <Divider />
      {role !== 'promoter' && (
        <>
          <List.Item
            style={styles.list}
            title="Invoice Orders"
            onPress={() => {
              navigation.navigate(ROUTES.invoice_order);
            }}
            left={props => <List.Icon {...props} icon="cart-arrow-up" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
          <Divider />
          <List.Item
            style={styles.list}
            title="Sales Return"
            onPress={() => {
              navigation.navigate(ROUTES.sales_return);
            }}
            left={props => <List.Icon {...props} icon="cart-remove" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
        </>
      )}
      <Text style={styles.textStyle}>Last Week Activities</Text>
      {role !== 'promoter' && (
        <>
          <List.Item
            style={styles.list}
            title="Orders"
            onPress={() => {
              navigation.navigate(ROUTES.weekly_order);
            }}
            left={props => <List.Icon {...props} icon="cart-outline" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
          <Divider />
        </>
      )}
      {/* <List.Item
        style={styles.list}
        title="Route Map"
        onPress={() => {
          navigation.navigate(ROUTES.weekly_route_map);
        }}
        left={props => <List.Icon {...props} icon="map-legend" />}
        right={props => <List.Icon {...props} icon="chevron-right" />}
      />
      <Divider />
      <Divider /> */}
      <List.Item
        style={styles.list}
        title="Total Visited"
        onPress={() => {
          navigation.navigate(ROUTES.weekly_total_visited);
        }}
        left={props => <List.Icon {...props} icon="map-marker-check-outline" />}
        right={props => <List.Icon {...props} icon="chevron-right" />}
      />
      <Divider />
      <Divider />
      {role !== 'promoter' && (
        <>
          <List.Item
            style={styles.list}
            title="Invoice Orders"
            onPress={() => {
              navigation.navigate(ROUTES.weekly_invoice_order);
            }}
            left={props => <List.Icon {...props} icon="cart-arrow-up" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
          <Divider />
          <List.Item
            style={styles.list}
            title="Sales Return"
            onPress={() => {
              navigation.navigate(ROUTES.weekly_sales_return);
            }}
            left={props => <List.Icon {...props} icon="cart-remove" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        </>
      )}
    </ScrollView>
  );
};

export default ActivityScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  textStyle: {
    marginVertical: 10,
  },
  list: {
    backgroundColor: '#fff',
  },
});
