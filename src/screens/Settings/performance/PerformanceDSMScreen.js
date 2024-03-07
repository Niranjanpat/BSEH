import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Divider, List, Text} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {ROUTES} from '../../../constants/routes';

const PerformanceDSMScreen = ({navigation, route}) => {
  const {role} = useSelector(state => state.auth);

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>Performance</Text>
      <List.Item
        style={styles.list}
        title="Daily Order"
        onPress={() => {
          navigation.navigate(ROUTES.daily_order, {role});
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
          navigation.navigate(ROUTES.today_customer_order, {role});
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
          navigation.navigate(ROUTES.top_customers, {role});
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
          navigation.navigate(ROUTES.customer_order, {role});
        }}
        left={props => <List.Icon {...props} icon="cart-remove" />}
        right={props => <List.Icon {...props} icon="chevron-right" />}
      />
      <Divider />
      <Divider />
      <List.Item
        style={styles.list}
        title="Order Log"
        onPress={() => {
          navigation.navigate(ROUTES.order_log_performance, {role});
        }}
        left={props => <List.Icon {...props} icon="cart-outline" />}
        right={props => <List.Icon {...props} icon="chevron-right" />}
      />
      <Divider />
      {role !== 'kam' && (
        <>
          <Divider />
          <List.Item
            style={styles.list}
            title="Top KAMs"
            onPress={() => {
              navigation.navigate(ROUTES.top_dsm);
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
              navigation.navigate(ROUTES.top_Distributors);
            }}
            left={props => <List.Icon {...props} icon="map-legend" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
        </>
      )}

      {role !== 'kam' && role !== 'dsm' && (
        <>
          <Divider />
          <List.Item
            style={styles.list}
            title="Top KAMs"
            onPress={() => {
              navigation.navigate(ROUTES.top_so);
            }}
            left={props => <List.Icon {...props} icon="cart-remove" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
        </>
      )}
    </View>
  );
};

export default PerformanceDSMScreen;
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
