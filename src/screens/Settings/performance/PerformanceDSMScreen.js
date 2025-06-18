import React from 'react';
import {View, StyleSheet} from 'react-native';
import {List, Text} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {ROUTES} from '../../../constants/routes';
import {COLORS} from '../../../constants/theme/colors'; // Ensure this path is correct

const PerformanceDSMScreen = ({navigation, route}) => {
  const {role: authRole} = useSelector(state => state.auth);

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
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Performance</Text>

      {renderItem('Order performance', 'cart-outline', ROUTES.order_performance, {role: authRole})}
      {renderItem('My performance', 'account', ROUTES.individual_performance, {id: null})}
      {renderItem('Sales performance', 'point-of-sale', ROUTES.sales_performance, {id: null})}

      {authRole !== 'cr' && authRole !== 'sr' && (
        renderItem('Team performance', 'account-group', ROUTES.team_performance)
      )}
    </View>
  );
};

export default PerformanceDSMScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
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
