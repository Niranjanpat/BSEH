import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {ROUTES} from '../../constants/routes';

import TopScsScreen from '../../screens/Settings/performance/TopScsScreen';
import DailyOrderScreen from '../../screens/Settings/performance/DailyOrderScreen';
import CustomerOrderScreen from '../../screens/Settings/performance/CustomerOrderScreen';
import TopCustomersScreen from '../../screens/Settings/performance/TopCustomersScreen';
import TopDistributorsScreen from '../../screens/Settings/performance/TopDistributorsScreen';
import TopSalesOfficerScreen from '../../screens/Settings/performance/TopSalesOfficerScreen';
import PerformanceDSMScreen from '../../screens/Settings/performance/PerformanceDSMScreen';
import TodayCustomerOrder from '../../screens/Settings/performance/TodayCustomerOrder';
import OrderLogScreen from '../../screens/Settings/performance/OrderLogScreen';
import TopZmsScreen from '../../screens/Settings/performance/TopZmsScreen';
import IndividualPerformanceScreen from '../../screens/Settings/performance/IndividualPerformanceScreen';
import OrderPerformanceScreen from '../../screens/Settings/performance/OrderPerformanceScreen';
import MTDPerformanceScreen from '../../screens/Settings/performance/MTDPerformanceScreen';
import TeamPerformanceScreen from '../../screens/Settings/performance/TeamPerformanceScreen';
import SalesPerformanceScreen from '../../screens/Settings/performance/SalesPerformanceScreen';
import TopAsmsScreen from '../../screens/Settings/performance/TopAsmsScreen';

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
        name={ROUTES.top_sc}
        component={TopScsScreen}
        options={{title: 'Top SCs'}}
      />
      <Screen
        name={ROUTES.top_asm}
        component={TopAsmsScreen}
        options={{title: 'Top ASMs'}}
      />
       <Screen
        name={ROUTES.top_zm}
        component={TopZmsScreen}
        options={{title: 'Top ZMs'}}
      /> 
      <Screen
        name={ROUTES.customer_order}
        component={CustomerOrderScreen}
        options={{title: 'Customers Order'}}
      />
      <Screen
        name={ROUTES.top_so}
        component={TopSalesOfficerScreen}
        options={{title: 'Top Sales Officer'}}
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
      <Screen
        name={ROUTES.individual_performance}
        component={IndividualPerformanceScreen}
        options={{title: 'My Performance'}}
      />
      <Screen
        name={ROUTES.order_performance}
        component={OrderPerformanceScreen}
        options={{title: 'Order performance'}}
      />
      <Screen
        name={ROUTES.team_performance}
        component={TeamPerformanceScreen}
        options={{title: 'Team performance'}}
      />
      <Screen
        name={ROUTES.sales_performance}
        component={SalesPerformanceScreen}
        options={{title: 'Sales performance'}}
      />
      <Screen
        name={ROUTES.mtd_performance}
        component={MTDPerformanceScreen}
        options={{title: 'MTD performances'}}
      />
    </Navigator>
  );
};
