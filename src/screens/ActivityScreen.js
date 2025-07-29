import React from 'react';
import {View, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import {Divider, List, Text} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {ROUTES} from '../constants/routes';
import {COLORS} from '../constants/theme/colors'; // Make sure this exists

const ActivityScreen = ({navigation}) => {
  // const {role} = useSelector(state => state.auth);

  const renderItem = (title, icon, route) => (
    <List.Item
      style={styles.list}
      title={title}
      titleStyle={styles.listTitle}
      onPress={() => navigation.navigate(route)}
      left={() => (
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

      <Text style={styles.sectionTitle}>Today's Activities</Text>
      {renderItem('Orders', 'cart-outline', ROUTES.order_screeen)}

      {/* {renderItem('Route Map', 'map-legend', ROUTES.route_map)} */}

      {renderItem(
        'Total Visited',
        'map-marker-check-outline',
        ROUTES.total_visited,
      )}
      {renderItem('Invoice Orders', 'cart-arrow-up', ROUTES.invoice_order)}

      {/* {renderItem('Sales Return', 'cart-remove', ROUTES.sales_return)} */}

      <Text style={styles.sectionTitle}>Last Week Activities</Text>

      {renderItem('Orders', 'cart-outline', ROUTES.weekly_order)}
      {/* {renderItem('Route Map', 'map-legend', ROUTES.weekly_route_map)} */}

      {renderItem(
        'Total Visited',
        'map-marker-check-outline',
        ROUTES.weekly_total_visited,
      )}
      {renderItem(
        'Invoice Orders',
        'cart-arrow-up',
        ROUTES.weekly_invoice_order,
      )}

      {/* {renderItem('Sales Return', 'cart-remove', ROUTES.weekly_sales_return)} */}
    </ScrollView>
  );
};

export default ActivityScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
   // backgroundColor: '#f9f9f9',
    flex: 1,
  },
  sectionTitle: {
    marginVertical: 10,
    color: '#212121',
    fontWeight: 'bold',
    fontSize: 16,
  },
  list: {
    backgroundColor: '#ffffff',
    paddingVertical: 0,
    paddingLeft:6,
    borderRadius: 10,
    marginVertical: 3,
    elevation: 0.5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  listTitle: {
    fontWeight: '700',
    color: '#212121',
  },
  iconWrapper: {
    backgroundColor: '#f1f9fe',
    borderRadius: 10,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
