import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {ROUTES} from '../../constants/routes';

import TopDsmScreen from '../../screens/Settings/performance/TopDsmScreen';
import DailyOrderScreen from '../../screens/Settings/performance/DailyOrderScreen';
import CustomerOrderScreen from '../../screens/Settings/performance/CustomerOrderScreen';
import TopCustomersScreen from '../../screens/Settings/performance/TopCustomersScreen';
import TopDistributorsScreen from '../../screens/Settings/performance/TopDistributorsScreen';
import TopSalesOfficerScreen from '../../screens/Settings/performance/TopSalesOfficerScreen';
import PerformanceDSMScreen from '../../screens/Settings/performance/PerformanceDSMScreen';
import TodayCustomerOrder from '../../screens/Settings/performance/TodayCustomerOrder';
import OrderLogScreen from '../../screens/Settings/performance/OrderLogScreen';

const {Navigator, Screen} = createNativeStackNavigator();
export const PerformanceStack = () => {
  return (
    <Navigator screenOptions={{animation: 'slide_from_right'}}>
      <Screen
        name={ROUTES.performance_screen}
        component={PerformanceDSMScreen}
        options={{title: 'Performance'}}
      />
      <Screen
        name={ROUTES.daily_order}
        component={DailyOrderScreen}
        options={{title: 'Daily Order'}}
      />
      <Screen
        name={ROUTES.top_Distributors}
        component={TopDistributorsScreen}
        options={{title: 'Top Distributor'}}
      />
      <Screen
        name={ROUTES.top_customers}
        component={TopCustomersScreen}
        options={{title: 'Top Customers'}}
      />
      <Screen
        name={ROUTES.top_dsm}
        component={TopDsmScreen}
        options={{title: 'Top KAM'}}
      />
      <Screen
        name={ROUTES.customer_order}
        component={CustomerOrderScreen}
        options={{title: 'Customers Order'}}
      />
      <Screen
        name={ROUTES.top_so}
        component={TopSalesOfficerScreen}
        options={{title: 'Top DSM'}}
      />
      <Screen
        name={ROUTES.today_customer_order}
        component={TodayCustomerOrder}
        options={{title: 'Today Order'}}
      />
      <Screen
        name={ROUTES.order_log_performance}
        component={OrderLogScreen}
        options={{title: 'Order Log'}}
      />
    </Navigator>
  );
};
