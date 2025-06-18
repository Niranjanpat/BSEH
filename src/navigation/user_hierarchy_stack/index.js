import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {ROUTES} from '../../constants/routes';
import PerformanceScreen from '../../screens/Settings/performance/PerformanceScreen';
import TopDistributorsScreen from '../../screens/Settings/performance/TopDistributorsScreen';
import TopCustomersScreen from '../../screens/Settings/performance/TopCustomersScreen';
import TopScsScreen from '../../screens/Settings/performance/TopScsScreen';
import CustomerOrderScreen from '../../screens/Settings/performance/CustomerOrderScreen';
import TopSalesOfficerScreen from '../../screens/Settings/performance/TopSalesOfficerScreen';
import UserHierarchyList from '../../screens/Settings/userHierarchy/UserHierarchyList';
import DailyOrderScreen from '../../screens/Settings/performance/DailyOrderScreen';
import TodayCustomerOrder from '../../screens/Settings/performance/TodayCustomerOrder';
import UserTargets from '../../screens/Settings/performance/UserTargets';
import BeatListScreen from '../../screens/Settings/performance/BeatListScreen';
import BeatCustomerList from '../../screens/Settings/performance/BeatCustomerList';
import OrderLogScreen from '../../screens/Settings/performance/OrderLogScreen';
import IndividualPerformanceScreen from '../../screens/Settings/performance/IndividualPerformanceScreen';
import MTDPerformanceScreen from '../../screens/Settings/performance/MTDPerformanceScreen';
import SalesPerformanceScreen from '../../screens/Settings/performance/SalesPerformanceScreen';
import TeamPerformanceScreen from '../../screens/Settings/performance/TeamPerformanceScreen';
//import UserCustomersScreen from '../../screens/Settings/performance/UserCustomersScreen';
import RetailerMasterDetailsScreen from '../../screens/RetailerMaster/RetailerMasterDetailsScreen';
import TopAsmsScreen from '../../screens/Settings/performance/TopAsmsScreen';
import TopZmsScreen from '../../screens/Settings/performance/TopZmsScreen';


const {Navigator, Screen} = createNativeStackNavigator();

export const UserHierarchyStack = () => {
  return (
    <Navigator screenOptions={{animation: 'slide_from_right'}}>
      <Screen
        name={ROUTES.user_hierarchy_list}
        component={UserHierarchyList}
        options={{title: 'User Hierarchy List'}}
      />
      <Screen
        name={ROUTES.performance_screen}
        component={PerformanceScreen}
        options={{title: 'Performance'}}
      />
      <Screen
        name={ROUTES.daily_order}
        component={DailyOrderScreen}
        options={{title: 'Daily Order'}}
      />
      <Screen
        name={ROUTES.today_customer_order}
        component={TodayCustomerOrder}
        options={{title: 'Today Order'}}
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
      {/* <Screen
        name={ROUTES.user_customers}
        component={UserCustomersScreen}
        options={{title: 'Customers'}}
      /> */}
      <Screen
        options={{
          headerShown: false,
        }}
        name={ROUTES.retailer_detail}
        component={RetailerMasterDetailsScreen}
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
        name={ROUTES.user_target}
        component={UserTargets}
        options={{title: 'User Targets'}}
      />
      <Screen
        name={ROUTES.user_beat}
        component={BeatListScreen}
        options={{title: 'User Beat'}}
      />
      <Screen
        name={ROUTES.beat_customer_list}
        component={BeatCustomerList}
        options={{title: 'Customer list (by beat)'}}
      />
      <Screen
        name={ROUTES.order_log_performance}
        component={OrderLogScreen}
        options={{title: 'Order log'}}
      />
      <Screen
        name={ROUTES.individual_performance}
        component={IndividualPerformanceScreen}
        options={{title: 'Individual performance'}}
      />
      <Screen
        name={ROUTES.sales_performance}
        component={SalesPerformanceScreen}
        options={{title: 'Sales performance'}}
      />
      <Screen
        name={ROUTES.team_performance}
        component={TeamPerformanceScreen}
        options={{title: 'Team performance'}}
      />
    </Navigator>
  );
};
