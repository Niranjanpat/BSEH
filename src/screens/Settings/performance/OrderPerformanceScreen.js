import React from 'react';
import {View, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import {Divider, List, Text} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {ROUTES} from '../../../constants/routes';
import {COLORS} from '../../../constants/theme/colors'; // Make sure this path is correct

const OrderPerformanceScreen = ({navigation, route}) => {
  const {role, id} = route?.params ?? {};
  const {role: userRole} = useSelector(state => state.auth);

  const renderItem = (title, icon, routeName, params = {}) => (
    <List.Item
      style={styles.list}
      title={title}
      titleStyle={styles.listTitle}
      onPress={() => navigation.navigate(routeName, params)}
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
      <Text style={styles.sectionTitle}>Performance</Text>

      {renderItem('Daily Order', 'cart-outline', ROUTES.daily_order, {
        id,
        role,
      })}
      {renderItem('Today Order', 'cart-outline', ROUTES.today_customer_order, {
        id,
        role,
      })}
      {renderItem(
        'Top Customers',
        'map-marker-check-outline',
        ROUTES.top_customers,
        {id, role},
      )}
      {renderItem('Customer Order', 'cart-remove', ROUTES.customer_order, {
        id,
        role,
      })}
      {renderItem('User Targets', 'cart-arrow-up', ROUTES.user_target, {
        id,
        role,
      })}
      {renderItem('Order Log', 'cart-outline', ROUTES.order_log_performance, {
        id,
        role,
      })}

      {role !== 'sc' &&
        renderItem('Top SCs', 'cart-arrow-up', ROUTES.top_sc, {id})}

      {role !== 'sc' &&
        role !== 'asm' &&
        renderItem('Top ASMs', 'cart-arrow-up', ROUTES.top_asm, {id})}

      {role !== 'sc' &&
        role !== 'asm' &&
        role !== 'zm' &&
        renderItem('Top ZMs', 'cart-arrow-up', ROUTES.top_zm, {id})}
    </ScrollView>
  );
};

export default OrderPerformanceScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
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
    paddingLeft: 6,
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
